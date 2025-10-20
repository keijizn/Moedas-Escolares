const API_BASE = 'http://localhost:8080';
const $ = (s, r=document)=> r.querySelector(s);
const join = (b,p)=> b.replace(/\/+$/,'') + '/' + String(p).replace(/^\/+/,'');

const EP = {
  list:  () => join(API_BASE, '/api/alunos'),
  one:   (id) => join(API_BASE, `/api/alunos/${id}`),
  create:() => join(API_BASE, '/api/alunos'),
  update:(id)=> join(API_BASE, `/api/alunos/${id}`),
  del:   (id)=> join(API_BASE, `/api/alunos/${id}`),
};

async function jget(url){ const r=await fetch(url); if(!r.ok) throw new Error(await r.text()); return r.json(); }
async function jpost(url,body){ const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
async function jput(url,body){ const r=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
async function jdel(url){ const r=await fetch(url,{method:'DELETE'}); if(!r.ok && r.status!==204) throw new Error(await r.text()); }

async function load(){
  $('#status').textContent = 'Carregando...';
  try{
    const data = await jget(EP.list());
    const tb = $('#tb tbody'); tb.innerHTML = '';
    data.forEach(a => tb.appendChild(row(a)));
    $('#status').textContent = `${data.length} aluno(s)`;
  }catch(e){
    $('#status').textContent = 'Erro: ' + e.message;
  }
}

function row(a){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input value="${a.nome||''}" data-k="nome"></td>
    <td><input value="${a.email||''}" data-k="email"></td>
    <td><input value="${a.cpf||''}" data-k="cpf"></td>
    <td><input value="${a.curso||''}" data-k="curso"></td>
    <td class="row-actions">
      <button class="btn small" data-act="save">Salvar</button>
      <button class="btn danger small" data-act="del">Excluir</button>
    </td>`;
  tr.querySelector('[data-act="save"]').onclick = async ()=>{
    const body = {
      nome: tr.querySelector('[data-k="nome"]').value.trim(),
      email: tr.querySelector('[data-k="email"]').value.trim(),
      cpf: tr.querySelector('[data-k="cpf"]').value.trim(),
      curso: tr.querySelector('[data-k="curso"]').value.trim()
    };
    try{ await jput(EP.update(a.id), body); await load(); }catch(e){ alert('Erro: '+e.message); }
  };
  tr.querySelector('[data-act="del"]').onclick = async ()=>{
    if(!confirm('Excluir este aluno?')) return;
    try{ await jdel(EP.del(a.id)); tr.remove(); }catch(e){ alert('Erro: '+e.message); }
  };
  return tr;
}

$('#btnAdd').onclick = async ()=>{
  const body = {
    nome:  $('#n-nome').value.trim(),
    email: $('#n-email').value.trim(),
    cpf:   $('#n-cpf').value.trim(),
    curso: $('#n-curso').value.trim()
  };
  $('#msgAdd').textContent = 'Enviando...';
  try{ await jpost(EP.create(), body); $('#msgAdd').textContent = 'Adicionado'; await load(); }
  catch(e){ $('#msgAdd').textContent = 'Erro: '+e.message; }
};

load();
