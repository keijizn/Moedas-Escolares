// js/professor.js
// Precisa de js/config.js: const API_BASE_URL = 'http://localhost:8080/api';

const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!user || user.role !== 'PROFESSOR') {
  location.href = 'login.html';
}
const professorId = Number(user.id);

// helper de DOM
const $ = (id) => document.getElementById(id);

// --- helper de fetch com fallback /professores -> /professor ---
function toSingular(path) {
  return path.replace('/professores/', '/professor/');
}
async function apiFetch(path, options = {}) {
  const urlPlural = `${API_BASE_URL}${path}`;
  console.log('↗️  fetch', urlPlural);
  let r = await fetch(urlPlural, options);

  if (r.status === 404 && path.startsWith('/professores/')) {
    const urlSing = `${API_BASE_URL}${toSingular(path)}`;
    console.warn('404 em plural, tentando singular:', urlSing);
    r = await fetch(urlSing, options);
  }
  return r;
}
// ----------------------------------------------------------------

async function enviar() {
  try {
    const alunoId = parseInt($('alunoId')?.value || '0', 10);
    const quantidade = parseInt($('quantidade')?.value || '0', 10);
    const motivo = $('motivo')?.value?.trim() || '';

    if (!alunoId || !quantidade) {
      alert('Informe o ID do aluno e a quantidade.');
      return;
    }

    const res = await apiFetch(`/professores/${professorId}/grant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alunoId, quantidade, motivo })
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Falha ao enviar (${res.status}): ${txt}`);
    }

    alert('Moedas enviadas!');
    await loadSaldo();
    await loadHist();
  } catch (e) {
    console.error(e);
    alert(e.message || 'Erro ao enviar moedas');
  }
}

async function loadSaldo() {
  const r = await apiFetch(`/professores/${professorId}/wallet`);
  if (!r.ok) throw new Error('Falha ao buscar saldo');
  const d = await r.json();
  $('saldo').textContent = Number(d.saldo ?? 0).toFixed(2);
}

async function loadHist() {
  const r = await apiFetch(`/professores/${professorId}/ledger`);
  if (!r.ok) throw new Error('Falha ao buscar histórico');
  const items = await r.json();
  const ul = $('hist');
  ul.innerHTML = '';
  items.forEach(i => {
    const li = document.createElement('li');
    li.textContent = `${i.ts} • ${i.kind} • ${i.amount} • ${i.descricao || ''}`;
    ul.appendChild(li);
  });
}

$('enviar').onclick = enviar;
$('sair').onclick = () => {
  localStorage.removeItem('user');
  location.href = 'login.html';
};

// carrega ao entrar
loadSaldo().catch(console.warn);
loadHist().catch(console.warn);
