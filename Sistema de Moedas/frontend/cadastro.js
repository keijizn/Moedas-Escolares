const API_BASE = 'http://localhost:8080';

const $ = (s,r=document)=> r.querySelector(s);
const toast = (m)=>{ const t=$('#toast'); if(!t) return; t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); };
function join(base, path){ return base.replace(/\/+$/,'') + '/' + String(path||'').replace(/^\/+/, ''); }

function showForm(type){
  document.querySelector('.tab[data-target="aluno"]').classList.toggle('active', type==='aluno');
  document.querySelector('.tab[data-target="empresa"]').classList.toggle('active', type==='empresa');
  $('#form-aluno').classList.toggle('hidden', type!=='aluno');
  $('#form-empresa').classList.toggle('hidden', type!=='empresa');
}
document.querySelectorAll('.tab').forEach(b=> b.addEventListener('click', ()=> showForm(b.dataset.target)));
(() => { const p=new URLSearchParams(location.search); showForm((p.get('tipo')||'aluno').toLowerCase()==='empresa'?'empresa':'aluno'); })();

const ENDPOINTS = {
  cadAluno:   () => join(API_BASE, '/api/auth/aluno/register'),
  cadEmpresa: () => join(API_BASE, '/api/auth/empresa/register'),
};

async function postJSON(url, data){
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  if(!r.ok){ const txt = await r.text(); throw new Error(txt || `HTTP ${r.status}`); }
  try { return await r.json(); } catch { return {}; }
}

$('#form-aluno')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f=e.target, s=$('#status-aluno');
  const payload={ nome:f.nome.value.trim(), email:f.email.value.trim(), cpf:f.cpf.value.trim(), curso:f.curso.value.trim(), senha:f.senha.value.trim() };
  s.textContent='Enviando...';
  try{ await postJSON(ENDPOINTS.cadAluno(), payload); s.textContent=''; toast('Aluno cadastrado!'); f.reset(); }
  catch(err){ s.textContent='Erro: '+err.message; }
});

$('#form-empresa')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f=e.target, s=$('#status-emp');
  const payload={ nomeFantasia:f.nomeFantasia.value.trim(), email:f.email.value.trim(), cnpj:f.cnpj.value.trim(), telefone:f.telefone.value.trim(), senha:f.senha.value.trim() };
  s.textContent='Enviando...';
  try{ await postJSON(ENDPOINTS.cadEmpresa(), payload); s.textContent=''; toast('Empresa cadastrada!'); f.reset(); }
  catch(err){ s.textContent='Erro: '+err.message; }
});
