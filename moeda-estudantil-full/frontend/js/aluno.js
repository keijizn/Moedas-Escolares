const user=JSON.parse(localStorage.getItem('user')||'null'); if(!user||user.role!=='ALUNO'){location.href='login.html';}
const id=user.id;
async function loadPerfil(){
  const r=await fetch(`${API_BASE_URL}/alunos/${id}`); const a=await r.json();
  document.getElementById('nome').value=a.nome||'';
  document.getElementById('curso').value=a.curso||'';
  document.getElementById('email').value=a.email||'';
}
async function salvar(){
  const body={nome:document.getElementById('nome').value,curso:document.getElementById('curso').value,email:document.getElementById('email').value};
  const r=await fetch(`${API_BASE_URL}/alunos/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok){alert('Erro ao salvar');return;} alert('Dados atualizados!');
}
async function excluir(){
  if(!confirm('Tem certeza? Esta ação é irreversível.')) return;
  const r=await fetch(`${API_BASE_URL}/alunos/${id}`,{method:'DELETE'});
  if(r.ok){ localStorage.removeItem('user'); location.href='login.html'; } else alert('Erro ao excluir.');
}
async function loadSaldo(){
  const r=await fetch(`${API_BASE_URL}/alunos/${id}/wallet`); const d=await r.json();
  document.getElementById('saldo').textContent = d.saldo;
}
async function loadHist(){
  const r=await fetch(`${API_BASE_URL}/alunos/${id}/ledger`); const items=await r.json();
  const ul=document.getElementById('hist'); ul.innerHTML=''; 
  items.forEach(i=>{ const li=document.createElement('li'); li.textContent=`${i.ts} • ${i.kind} • ${i.amount} • ${i.reason||''}`; ul.appendChild(li); });
}
async function loadBeneficios(){
  const r=await fetch(`${API_BASE_URL}/beneficios`); const items=await r.json();
  const ul=document.getElementById('beneficios'); ul.innerHTML='';
  items.forEach(b=>{ const li=document.createElement('li'); li.innerHTML=`<strong>${b.titulo}</strong> — custo ${b.custo} <button data-id="${b.id}">Resgatar</button>`; ul.appendChild(li); });
  ul.onclick=async(e)=>{ const btn=e.target.closest('button'); if(!btn) return; const benId=btn.getAttribute('data-id'); 
    const r=await fetch(`${API_BASE_URL}/alunos/${id}/redeem/${benId}`,{method:'POST'}); if(!r.ok){alert('Falha ao resgatar');return;}
    alert('Benefício resgatado!'); loadSaldo(); loadHist();
  };
}
document.getElementById('salvar').onclick=salvar;
document.getElementById('excluir').onclick=excluir;
document.getElementById('sair').onclick=()=>{ localStorage.removeItem('user'); location.href='login.html'; };
loadPerfil(); loadSaldo(); loadHist(); loadBeneficios();
