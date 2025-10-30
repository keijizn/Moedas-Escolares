const user=JSON.parse(localStorage.getItem('user')||'null'); if(!user||user.role!=='EMPRESA'){location.href='login.html';}
const id=user.id;
async function criarBeneficio(){
  const titulo=document.getElementById('titulo').value.trim();
  const descricao=document.getElementById('descricao').value.trim();
  const custo=parseInt(document.getElementById('custo').value||'0',10);
  if(!titulo||!custo){ alert('Preencha título e custo.'); return; }
  const r=await fetch(`${API_BASE_URL}/empresas/${id}/beneficios`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo,descricao,custo})});
  if(!r.ok){ alert('Erro ao criar benefício'); return; } alert('Benefício criado!'); listarBeneficios();
}
async function listarBeneficios(){
  const r=await fetch(`${API_BASE_URL}/empresas/${id}/beneficios`); const items=await r.json();
  const ul=document.getElementById('lista-beneficios'); ul.innerHTML=''; items.forEach(b=>{ const li=document.createElement('li'); li.textContent=`#${b.id} • ${b.titulo} (custo ${b.custo})`; ul.appendChild(li); });
}
async function enviarMoedas(){
  const professorId=parseInt(document.getElementById('professorId').value||'0',10);
  const amount=parseInt(document.getElementById('amount').value||'0',10);
  const reason=document.getElementById('reason').value;
  if(!professorId||!amount){ alert('Informe professor e quantidade.'); return; }
  const r=await fetch(`${API_BASE_URL}/empresas/${id}/grant`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({professorId,amount,reason})});
  if(!r.ok){ alert('Falha ao enviar'); return; } alert('Moedas enviadas!'); loadSaldo(); loadHist();
}
async function loadSaldo(){
  const r=await fetch(`${API_BASE_URL}/empresas/${id}/wallet`); const d=await r.json();
  document.getElementById('saldo').textContent=d.saldo;
}
async function loadHist(){
  const r=await fetch(`${API_BASE_URL}/empresas/${id}/ledger`); const items=await r.json();
  const ul=document.getElementById('hist'); ul.innerHTML=''; items.forEach(i=>{ const li=document.createElement('li'); li.textContent=`${i.ts} • ${i.kind} • ${i.amount} • ${i.reason||''}`; ul.appendChild(li); });
}
document.getElementById('criar').onclick=criarBeneficio;
document.getElementById('enviar').onclick=enviarMoedas;
document.getElementById('sair').onclick=()=>{ localStorage.removeItem('user'); location.href='login.html'; };
listarBeneficios(); loadSaldo(); loadHist();
