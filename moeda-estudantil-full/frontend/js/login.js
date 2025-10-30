async function login(){
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  if(!email || !senha){ alert('Preencha e-mail e senha.'); return; }
  try{
    const resp = await fetch(`${API_BASE_URL}/auth/login`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ role, email, senha })
    });
    if(!resp.ok){ throw new Error('Login inválido'); }
    const data = await resp.json();
    localStorage.setItem('user', JSON.stringify(data));
    if(data.role==='ALUNO') location.href='aluno.html';
    else if(data.role==='PROFESSOR') location.href='professor.html';
    else if(data.role==='EMPRESA') location.href='empresa.html';
    else alert('Papel desconhecido.');
  }catch(e){ alert(e.message); }
}
document.getElementById('btnLogin').addEventListener('click', login);
