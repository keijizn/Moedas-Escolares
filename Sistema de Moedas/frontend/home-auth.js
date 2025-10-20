// =============== Configuração ===============
const API_BASE = 'http://localhost:8080'; // altere aqui se mudar de porta/host

// =============== utilitários ===============
const $ = (s, r = document) => r.querySelector(s);
const toast = (m) => {
  const t = $('#toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
};
const api = () => API_BASE.replace(/\/+$/, '');
function join(base, path){ return base.replace(/\/+$/,'') + '/' + String(path||'').replace(/^\/+/, ''); }

async function readError(resp){
  try { const txt = await resp.text(); try { const j = JSON.parse(txt); return j.message || j.error || txt; } catch { return txt || `HTTP ${resp.status}`; } }
  catch { return `HTTP ${resp.status}`; }
}
async function postJSON(url, data){
  const resp = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  if(!resp.ok) throw new Error(await readError(resp));
  try { return await resp.json(); } catch { return {}; }
}

// =============== ENDPOINTS ===============
const ENDPOINTS = {
  cadAluno:   () => join(api(), '/api/auth/aluno/register'),
  cadEmpresa: () => join(api(), '/api/auth/empresa/register'),
  login:      () => join(api(), '/api/auth/login'),
};

// =============== Modais ===============
function openModal(id){ $(`#ovl${id}`)?.removeAttribute('hidden'); $(`#mdl${id}`)?.removeAttribute('hidden'); }
function closeModals(){ document.querySelectorAll('.overlay,.modal').forEach(el=> el.setAttribute('hidden','')); }
document.addEventListener('click', (ev)=> { if (ev.target.matches('[data-close], .overlay')) closeModals(); });

$('#openLogin')?.addEventListener('click', ()=> openModal('Login'));
$('#openCadastro')?.addEventListener('click', ()=> openModal('Cadastro'));
$('#cadAluno')?.addEventListener('click', ()=>{ openModal('Cadastro'); switchTab('cad-aluno'); });
$('#cadEmpresa')?.addEventListener('click', ()=>{ openModal('Cadastro'); switchTab('cad-empresa'); });
$('#loginAluno')?.addEventListener('click', ()=>{ openModal('Login'); switchTab('login-aluno'); });
$('#loginEmpresa')?.addEventListener('click', ()=>{ openModal('Login'); switchTab('login-empresa'); });

// =============== Abas ===============
function switchTab(id){
  document.querySelectorAll('.tab').forEach(t=>{
    const active = t.dataset.tab===id;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.modal form').forEach(f=> f.hidden = (f.id !== id));
}
document.querySelectorAll('.tab').forEach(tab=> tab.addEventListener('click', ()=> switchTab(tab.dataset.tab)));

// =============== Submit: Aluno ===============
$('#cad-aluno')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f = e.target, msg = $('#cadAlunoMsg'); msg.textContent = 'Enviando...';
  const payload = { nome:f.nome.value.trim(), email:f.email.value.trim(), cpf:f.cpf.value.trim(), curso:f.curso.value.trim(), senha:f.senha.value.trim() };
  try{
    await postJSON(ENDPOINTS.cadAluno(), payload);
    msg.textContent = 'Cadastrado! Faça login.'; toast('Aluno cadastrado');
    switchTab('login-aluno');
  }catch(err){ msg.textContent = 'Erro: ' + err.message; }
});

// =============== Submit: Empresa ===============
$('#cad-empresa')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f = e.target, msg = $('#cadEmpresaMsg'); msg.textContent = 'Enviando...';
  const payload = { nomeFantasia:f.nomeFantasia.value.trim(), email:f.email.value.trim(), cnpj:f.cnpj.value.trim(), telefone:f.telefone.value.trim(), senha:f.senha.value.trim() };
  try{
    await postJSON(ENDPOINTS.cadEmpresa(), payload);
    msg.textContent = 'Cadastrada! Faça login.'; toast('Empresa cadastrada');
    switchTab('login-empresa');
  }catch(err){ msg.textContent = 'Erro: ' + err.message; }
});

// =============== Login ===============
async function doLogin(tipo, form, statusSel){
  const f = form, msg = $(statusSel); msg.textContent = 'Validando...';
  const payload = { email:f.email.value.trim(), senha:f.senha.value.trim(), tipo };
  try{
    const data = await postJSON(ENDPOINTS.login(), payload);
    if(data.token)  localStorage.setItem('authToken', data.token);
    if(data.userId) localStorage.setItem('userId', data.userId);
    localStorage.setItem('role', data.role || tipo);
    localStorage.setItem('userName', data.nome || '');
    toast('Login OK');
    window.location.href = './index.html';
  }catch(err){ msg.textContent = 'Erro: ' + err.message; }
}
$('#login-aluno')?.addEventListener('submit', (e)=>{ e.preventDefault(); doLogin('ALUNO', e.target, '#loginAlunoMsg'); });
$('#login-empresa')?.addEventListener('submit', (e)=>{ e.preventDefault(); doLogin('EMPRESA', e.target, '#loginEmpresaMsg'); });
