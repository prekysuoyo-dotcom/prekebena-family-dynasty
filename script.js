// Cloudinary and Web App info
const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzVwwg8oFBEGYpvfoXITHvKJ87E3MloUOEiNbqIS-dXD8N6oSIZcACx5l2s8uGv0ZPE/exec";

// Registration form
document.getElementById('registerForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const form = e.target;
  const file = document.getElementById('profilePicture').files[0];

  // Upload image to Cloudinary
  const formDataCloud = new FormData();
  formDataCloud.append('file', file);
  formDataCloud.append('upload_preset', UPLOAD_PRESET);

  let imageUrl = "";
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {method:'POST', body:formDataCloud});
    const data = await res.json();
    imageUrl = data.secure_url;
  } catch(err){ alert("Image upload failed: "+err); return; }

  // Send data to Google Sheet
  const sheetData = new FormData(form);
  sheetData.append('profilePicture', imageUrl);
  sheetData.append('action','register');

  fetch(WEB_APP_URL, {method:'POST', body:sheetData})
    .then(res => res.text())
    .then(msg => { alert(msg); form.reset(); })
    .catch(err => alert("Registration failed: "+err));
});

// Login form
document.getElementById('loginForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const formData = new FormData(this);
  formData.append('action','login');

  const res = await fetch(WEB_APP_URL, {method:'POST', body:formData});
  const result = await res.json();

  if(result.status === "success"){
    if(result.role === "admin"){
      window.location.href = "admin.html";
    } else {
      alert("Logged in successfully as member!");
    }
  } else { alert("Invalid credentials"); }
});
