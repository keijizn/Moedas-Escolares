// js/empresa.js
// precisa de js/config.js com:  const API_BASE_URL = 'http://localhost:8080/api';

const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!user || user.role !== 'EMPRESA') {
  location.href = 'login.html';
}
const empresaId = Number(user.id);
console.log('[EMPRESA] API_BASE_URL:', API_BASE_URL, 'empresaId:', empresaId);

// helpers DOM
const $ = (id) => document.getElementById(id);

// ------------------------ FETCH BASE ------------------------
function toSingular(path) {
  return path.replace('/empresas/', '/empresa/');
}
async function apiFetch(path, options = {}) {
  const urlPlural = `${API_BASE_URL}${path}`;
  console.log('[fetch] →', urlPlural, options);
  let r;
  try {
    r = await fetch(urlPlural, options);
  } catch (e) {
    console.error('[fetch] ERRO de rede:', e);
    throw e;
  }

  if (r.status === 404 && path.startsWith('/empresas/')) {
    const urlSing = `${API_BASE_URL}${toSingular(path)}`;
    console.warn('404 em plural, tentando singular:', urlSing);
    r = await fetch(urlSing, options);
  }
  console.log('[fetch] ←', r.status, r.statusText);
  return r;
}
// ------------------------------------------------------------

// ===== SALDO =====
async function carregarSaldo() {
  try {
    const r = await apiFetch(`/empresas/${empresaId}/wallet`);
    if (!r.ok) throw new Error(`Falha ao buscar saldo (${r.status})`);
    const d = await r.json();
    console.log('[saldo]', d);
    $('saldo').textContent = Number(d.saldo ?? 0).toFixed(2);
  } catch (e) {
    console.error('[saldo] erro:', e);
    $('saldo').textContent = '—';
  }
}

// ===== HISTÓRICO =====
async function carregarHistorico() {
  try {
    const r = await apiFetch(`/empresas/${empresaId}/ledger`);
    if (!r.ok) throw new Error(`Falha ao buscar histórico (${r.status})`);
    const items = await r.json();
    console.log('[ledger]', items);

    const ul = $('hist');
    ul.innerHTML = '';

    const arr = Array.isArray(items) ? items : [];
    arr.forEach(i => {
      const li = document.createElement('li');
      li.textContent = `${i.ts} • ${i.kind} • ${i.amount} • ${i.reason || ''}`;
      ul.appendChild(li);
    });
  } catch (e) {
    console.error('[ledger] erro:', e);
    $('hist').innerHTML = '<li>Erro ao carregar histórico.</li>';
  }
}

// ===== BENEFÍCIOS =====
async function listarBeneficios() {
  try {
    const r = await apiFetch(`/empresas/${empresaId}/beneficios`);
    if (!r.ok) throw new Error(`Falha ao listar benefícios (${r.status})`);
    const items = await r.json();
    console.log('[beneficios]', items);

    const list = $('lista-beneficios');
    list.innerHTML = '';

    const arr = Array.isArray(items) ? items : [];
    if (arr.length === 0) {
      list.innerHTML = '<li>Nenhum benefício cadastrado.</li>';
      return;
    }

    arr.forEach(b => {
      const li = document.createElement('li');
      li.textContent = `${b.titulo} — ${b.descricao || ''} (custo: ${b.custo})`;
      list.appendChild(li);
    });
  } catch (e) {
    console.error('[beneficios] erro:', e);
    $('lista-beneficios').innerHTML = '<li>Erro ao carregar benefícios.</li>';
  }
}

// ===== CRIAR BENEFÍCIO =====
async function criarBeneficio() {
  try {
    const titulo = $('titulo')?.value?.trim() || '';
    const descricao = $('descricao')?.value?.trim() || '';
    const custo = parseInt($('custo')?.value || '0', 10);

    if (!titulo || !custo) {
      alert('Informe título e custo.');
      return;
    }

    const r = await apiFetch(`/empresas/${empresaId}/beneficios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao, custo })
    });

    const txt = await r.text().catch(() => '');
    if (!r.ok) throw new Error(`Falha ao criar benefício (${r.status}): ${txt}`);

    $('titulo').value = '';
    $('descricao').value = '';
    $('custo').value = '';
    await listarBeneficios();
    alert('Benefício criado com sucesso!');
  } catch (e) {
    console.error('[criar beneficio] erro:', e);
    alert(e.message || 'Erro ao criar benefício');
  }
}

// ===== ENVIAR MOEDAS PARA PROFESSOR =====
function parseIntSafe(id) {
  const v = ($(id)?.value ?? '').trim();
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

async function enviarMoedas(e) {
  e?.preventDefault?.();

  // IDs que existem no HTML:
  const professorId = parseIntSafe('professorId');
  const amount      = parseIntSafe('quantidade');
  const reason      = ($('motivo')?.value || '').trim();

  if (!professorId || !amount) {
    alert('Informe o ID do professor e a quantidade de moedas.');
    return;
  }

  try {
    const r = await apiFetch(`/empresas/${empresaId}/grant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professorId, amount, reason })
    });

    const txt = await r.text().catch(() => '');
    if (!r.ok) throw new Error(`Falha ao enviar moedas (${r.status}): ${txt}`);

    alert('Moedas enviadas com sucesso!');
    await carregarSaldo();
    await carregarHistorico();
  } catch (e2) {
    console.error('[grant] erro:', e2);
    alert(e2.message || 'Erro ao enviar moedas');
  }
}

// ===== BOTÕES =====
$('criar').onclick = criarBeneficio;
$('enviar').addEventListener('click', enviarMoedas);
$('sair').onclick = () => {
  localStorage.removeItem('user');
  location.href = 'login.html';
};

// ===== INICIALIZAÇÃO =====
carregarSaldo().catch(console.warn);
carregarHistorico().catch(console.warn);
listarBeneficios().catch(console.warn);
