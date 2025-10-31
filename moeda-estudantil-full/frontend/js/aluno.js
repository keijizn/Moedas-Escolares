// js/aluno.js
// Precisa de js/config.js com:  const API_BASE_URL = 'http://localhost:8080/api';

const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!user || user.role !== 'ALUNO') {
  location.href = 'login.html';
}
const id = Number(user.id);

// Helpers DOM
const $ = (id) => document.getElementById(id);

// ========== PERFIL ==========
async function loadPerfil() {
  try {
    const r = await fetch(`${API_BASE_URL}/alunos/${id}`);
    if (!r.ok) {
      console.error('Falha ao buscar perfil', r.status, await r.text().catch(() => ''));
      return;
    }
    const a = await r.json();
    $('nome').value  = a?.nome  ?? '';
    $('curso').value = a?.curso ?? '';
    $('email').value = a?.email ?? '';
  } catch (e) {
    console.error('Erro loadPerfil', e);
  }
}

async function salvar() {
  try {
    const body = {
      nome:  $('nome').value,
      curso: $('curso').value,
      email: $('email').value
    };
    const r = await fetch(`${API_BASE_URL}/alunos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      alert(`Erro ao salvar (${r.status}): ${txt}`);
      return;
    }
    alert('Dados atualizados!');
  } catch (e) {
    console.error(e);
    alert('Falha ao salvar.');
  }
}

async function excluir() {
  try {
    if (!confirm('Tem certeza? Esta ação é irreversível.')) return;
    const r = await fetch(`${API_BASE_URL}/alunos/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      alert(`Erro ao excluir (${r.status}): ${txt}`);
      return;
    }
    localStorage.removeItem('user');
    location.href = 'login.html';
  } catch (e) {
    console.error(e);
    alert('Falha ao excluir.');
  }
}

// ========== SALDO ==========
async function loadSaldo() {
  try {
    const r = await fetch(`${API_BASE_URL}/alunos/${id}/wallet`);
    if (!r.ok) {
      console.error('Falha ao buscar saldo', r.status, await r.text().catch(() => ''));
      $('saldo').textContent = '—';
      return;
    }
    const d = await r.json();
    $('saldo').textContent = Number(d?.saldo ?? 0).toFixed(2);
  } catch (e) {
    console.error(e);
    $('saldo').textContent = '—';
  }
}

// ========== HISTÓRICO ==========
async function loadHist() {
  try {
    const r = await fetch(`${API_BASE_URL}/alunos/${id}/ledger`);
    const ul = $('hist');

    if (!r.ok) {
      console.error('Falha ao buscar histórico', r.status, await r.text().catch(() => ''));
      ul.innerHTML = '<li>Erro ao carregar histórico.</li>';
      return;
    }

    const items = await r.json();
    const arr = Array.isArray(items) ? items : [];

    ul.innerHTML = '';
    arr.forEach(i => {
      const li = document.createElement('li');
      li.textContent = `${i.ts} • ${i.kind} • ${i.amount} • ${i.reason || ''}`;
      ul.appendChild(li);
    });
  } catch (e) {
    console.error(e);
    $('hist').innerHTML = '<li>Erro ao carregar histórico.</li>';
  }
}

// ========== BENEFÍCIOS ==========
async function loadBeneficios() {
  try {
    const r = await fetch(`${API_BASE_URL}/beneficios`);
    if (!r.ok) {
      console.error('Falha ao listar benefícios', r.status, await r.text().catch(() => ''));
      $('beneficios').innerHTML = '<li>Erro ao carregar benefícios.</li>';
      return;
    }

    const items = await r.json();
    const arr = Array.isArray(items) ? items : [];
    const ul = $('beneficios');
    ul.innerHTML = '';

    if (arr.length === 0) {
      ul.innerHTML = '<li>Nenhum benefício disponível.</li>';
      return;
    }

    arr.forEach(b => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${b.titulo}</strong> — custo ${b.custo}
        <button data-id="${b.id}">Resgatar</button>
      `;
      ul.appendChild(li);
    });

    ul.onclick = async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const benId = btn.getAttribute('data-id');
      try {
        const r2 = await fetch(`${API_BASE_URL}/alunos/${id}/redeem/${benId}`, { method: 'POST' });
        if (!r2.ok) {
          const txt = await r2.text().catch(() => '');
          alert(`Falha ao resgatar (${r2.status}): ${txt}`);
          return;
        }
        alert('Benefício resgatado!');
        await loadSaldo();
        await loadHist();
      } catch (err) {
        console.error(err);
        alert('Erro ao resgatar benefício.');
      }
    };
  } catch (e) {
    console.error(e);
    $('beneficios').innerHTML = '<li>Erro ao carregar benefícios.</li>';
  }
}

// Botões
$('salvar').onclick = salvar;
$('excluir').onclick = excluir;
$('sair').onclick = () => {
  localStorage.removeItem('user');
  location.href = 'login.html';
};

// Inicialização
loadPerfil();
loadSaldo();
loadHist();
loadBeneficios();
