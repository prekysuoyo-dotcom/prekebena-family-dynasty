const WEB_APP_URL = "YOUR_GOOGLE_SHEET_WEB_APP_URL";

// Hero Modal Logic
const modal = document.getElementById('modal');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const closeBtn = document.querySelector('.close');
const modalRegister = document.getElementById('modal-register');
const modalLogin = document.getElementById('modal-login');

registerBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  modalRegister.classList.add('active');
  modalLogin.classList.remove('active');
});

loginBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  modalLogin.classList.add('active');
  modalRegister.classList.remove('active');
});

closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', (e) => { if(e.target===modal) modal.style.display='none'; });

// Register function
async function register(form) {
  const formData = new FormData(form);
  formData.append('action','register');

  const res = await fetch(WEB_APP_URL, { method:'POST', body: formData });
  const result = await res.text();
  alert(result);
  form.reset();
  modal.style.display = 'none';
}

// Login function
async function login(form) {
  const formData = new FormData(form);
  formData.append('action','login');

  const res = await fetch(WEB_APP_URL, { method:'POST', body: formData });
  const result = await res.json();
  if(result.status==="success"){
    if(result.role==="admin") window.location.href="admin.html";
    else alert("Logged in successfully as member!");
    modal.style.display = 'none';
  } else alert("Invalid credentials");
}

// Event Listeners
document.getElementById('registerFormModal').addEventListener('submit', e=>{ e.preventDefault(); register(e.target); });
document.getElementById('loginFormModal').addEventListener('submit', e=>{ e.preventDefault(); login(e.target); });
