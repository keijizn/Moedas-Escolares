const API_BASE = 'http://localhost:8080';
const $ = (s, r=document)=> r.querySelector(s);
const join = (b,p)=> b.replace(/\/+$/,'') + '/' + String(p).replace(/^\/+/,'');

const EP = {
  list:  () => join(API_BASE, '/api/empresas'),
  one:   (id) => join(API_BASE, `/api/empresas/${id}`),
  create:() => join(API_BASE, '/api/empresas'),
  update:(id)=> join(API_BASE, `/api/empresas/${id}`),
  del:   (id)=> join(API_BASE, `/api/empresas/${id}`),
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
    data.forEach(e => tb.appendChild(row(e)));
    $('#status').textContent = `${data.length} empresa(s)`;
  }catch(e){
    $('#status').textContent = 'Erro: ' + e.message;
  }
}

function row(e){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input value="${e.nomeFantasia||''}" data-k="nomeFantasia"></td>
    <td><input value="${e.email||''}" data-k="email"></td>
    <td><input value="${e.cnpj||''}" data-k="cnpj"></td>
    <td><input value="${e.telefone||''}" data-k="telefone"></td>
    <td><input value="${e.descricao||''}" data-k="descricao"></td>
    <td class="row-actions">
      <button class="btn small" data-act="save">Salvar</button>
      <button class="btn danger small" data-act="del">Excluir</button>
    </td>`;
  tr.querySelector('[data-act="save"]').onclick = async ()=>{
    const body = {
      nomeFantasia: tr.querySelector('[data-k="nomeFantasia"]').value.trim(),
      email:        tr.querySelector('[data-k="email"]').value.trim(),
      cnpj:         tr.querySelector('[data-k="cnpj"]').value.trim(),
      telefone:     tr.querySelector('[data-k="telefone"]').value.trim(),
      descricao:    tr.querySelector('[data-k="descricao"]').value.trim(),
    };
    try{ await jput(EP.update(e.id), body); await load(); }catch(err){ alert('Erro: '+e.message); }
  };
  tr.querySelector('[data-act="del"]').onclick = async ()=>{
    if(!confirm('Excluir esta empresa?')) return;
    try{ await jdel(EP.del(e.id)); tr.remove(); }catch(err){ alert('Erro: '+e.message); }
  };
  return tr;
}

$('#btnAdd').onclick = async ()=>{
  const body = {
    nomeFantasia: $('#n-nome').value.trim(),
    email:        $('#n-email').value.trim(),
    cnpj:         $('#n-cnpj').value.trim(),
    telefone:     $('#n-tel').value.trim(),
    descricao:    $('#n-desc').value.trim()
  };
  $('#msgAdd').textContent = 'Enviando...';
  try{ await jpost(EP.create(), body); $('#msgAdd').textContent = 'Adicionada'; await load(); }
  catch(e){ $('#msgAdd').textContent = 'Erro: '+e.message; }
};

load();
