const CLOUD_NAME = "YOUR_CLOUD_NAME";      
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; 
const WEB_APP_URL = "YOUR_WEB_APP_URL";    

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

// Registration Function (both modal and bottom form)
async function register(form, fileInput) {
  const file = fileInput.files[0];
  const formDataCloud = new FormData();
  formDataCloud.append('file', file);
  formDataCloud.append('upload_preset', UPLOAD_PRESET);

  let imageUrl = "";
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method:'POST', body: formDataCloud });
    const data = await res.json();
    imageUrl = data.secure_url;
  } catch (err) { alert("Image upload failed: " + err); return; }

  const sheetData = new FormData(form);
  sheetData.append('ImageURL', imageUrl);
  sheetData.append('action','register');

  fetch(WEB_APP_URL, { method:'POST', body:sheetData })
    .then(res=>res.text()).then(msg=>{ alert(msg); form.reset(); })
    .catch(err=>alert("Registration failed: "+err));
}

// Login Function (both modal and bottom form)
async function login(form) {
  const formData = new FormData(form);
  formData.append('action','login');

  const res = await fetch(WEB_APP_URL, { method:'POST', body:formData });
  const result = await res.json();
  if(result.status==="success"){
    if(result.role==="admin") window.location.href="admin.html";
    else alert("Logged in successfully as member!");
  } else alert("Invalid credentials");
}

// Event Listeners for Forms
document.getElementById('registerForm').addEventListener('submit', e=>{ e.preventDefault(); register(e.target, document.getElementById('profilePicture')); });
document.getElementById('registerFormModal').addEventListener('submit', e=>{ e.preventDefault(); register(e.target, document.getElementById('profilePictureModal')); });
document.getElementById('loginForm').addEventListener('submit', e=>{ e.preventDefault(); login(e.target); });
document.getElementById('loginFormModal').addEventListener('submit', e=>{ e.preventDefault(); login(e.target); });
