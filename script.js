const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw3b-ldsgd7J6m8XGnD0ZPp-H_hpi-jYtg3Ay1s51Qbrlu2jY8FAWvALIz6MvYdAXWo/exec";

// Modal
const modal = document.getElementById('modal');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const closeBtn = document.querySelector('.close');
const modalRegister = document.getElementById('registerFormModal');
const modalLogin = document.getElementById('loginFormModal');

registerBtn.onclick = () => {
  modal.style.display = 'flex';
  modalRegister.classList.add('active');
  modalLogin.classList.remove('active');
};
loginBtn.onclick = () => {
  modal.style.display = 'flex';
  modalLogin.classList.add('active');
  modalRegister.classList.remove('active');
};
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = e => { if(e.target === modal) modal.style.display='none'; };

// Current Date (Nigeria)
const options = { timeZone: 'Africa/Lagos', weekday:'long', year:'numeric', month:'long', day:'numeric' };
document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-NG', options);

// Register
async function register(form){
  const data = new FormData(form);
  data.append('action','register');
  try{
    const response = await fetch(WEB_APP_URL, { method:'POST', body:data });
    const result = await response.text();
    alert(result);
    form.reset();
    modal.style.display='none';
  }catch(err){ alert("Registration failed: "+err); }
}

// Login
async function login(form){
  const data = new FormData(form);
  data.append('action','login');
  try{
    const response = await fetch(WEB_APP_URL, { method:'POST', body:data });
    const result = await response.json();
    if(result.status==='success'){
      alert("Login successful!");
      if(result.role==='admin') window.location.href='admin.html';
      else window.location.href='membership.html';
      modal.style.display='none';
    }else alert("Invalid email or password");
  }catch(err){ alert("Login failed: "+err); }
}

modalRegister.addEventListener('submit', e=>{ e.preventDefault(); register(e.target); });
modalLogin.addEventListener('submit', e=>{ e.preventDefault(); login(e.target); });
