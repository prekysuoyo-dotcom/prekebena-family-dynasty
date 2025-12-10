/* script.js - handles register / login / profile using your Google Apps Script API */
const API_URL = "https://script.google.com/macros/s/AKfycbw3b-ldsgd7J6m8XGnD0ZPp-H_hpi-jYtg3Ay1s51Qbrlu2jY8FAWvALIz6MvYdAXWo/exec";
const STORAGE_KEY = "prekebenaUser";

/* ---------- Registration ---------- */
async function handleRegisterForm(ev) {
  ev.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const imageUrl = (document.getElementById("imageUrl") && document.getElementById("imageUrl").value.trim()) || "";

  const form = new FormData();
  form.append("action", "register");
  form.append("name", name);
  form.append("email", email);
  form.append("phone", phone);
  form.append("password", password);
  form.append("imageUrl", imageUrl);

  try {
    const res = await fetch(API_URL, { method: "POST", body: form });
    const data = await res.json();
    if (data.status === "exists") {
      Swal && Swal.fire ? Swal.fire("Already registered", data.message, "info") : alert(data.message);
      return;
    }
    if (data.status === "success") {
      (Swal && Swal.fire) ?
        Swal.fire("Registration successful", "An email has been sent to you with your login details. Thank you for joining the Prekebena Family Dynasty.", "success")
        : alert("Registration successful! An email has been sent to you with your login details.");
      window.setTimeout(() => window.location.href = "login.html", 1600);
      return;
    }
    throw new Error(JSON.stringify(data));
  } catch (err) {
    console.error("Register error", err);
    const msg = (err && err.message) || "Registration failed. Try again.";
    Swal && Swal.fire ? Swal.fire("Error", msg, "error") : alert(msg);
  }
}

/* ---------- Login ---------- */
async function handleLoginForm(ev) {
  ev.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const form = new FormData();
  form.append("action", "login");
  form.append("email", email);
  form.append("password", password);

  try {
    const res = await fetch(API_URL, { method: "POST", body: form });
    const data = await res.json();

    if (data.status === "success") {
      // store minimal user profile in localStorage
      const user = {
        name: data.name || "",
        email: email,
        phone: data.phone || "",
        role: data.role || "member",
        image: data.image || ""
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

      Swal && Swal.fire ? Swal.fire("Welcome", `Hello ${user.name || "member"}`, "success") : alert("Login successful");

      // redirect based on role
      if (user.role === "admin") window.location.href = "admin.html";
      else window.location.href = "profile.html";
      return;
    }

    // login failed
    Swal && Swal.fire ? Swal.fire("Login failed", "Invalid email or password", "error") : alert("Invalid email or password");
  } catch (err) {
    console.error("Login error", err);
    Swal && Swal.fire ? Swal.fire("Error", "Login failed. Try again.", "error") : alert("Login failed. Try again.");
  }
}

/* ---------- Profile page rendering ---------- */
function renderProfilePage() {
  const profileArea = document.getElementById("profileArea");
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // not logged in
    window.location.href = "login.html";
    return;
  }
  const user = JSON.parse(raw);
  const imgHtml = user.image ? `<img src="${user.image}" alt="Profile" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:12px;">` : `<div style="width:120px;height:120px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;margin-bottom:12px;">No Image</div>`;
  profileArea.innerHTML = `
    <div style="text-align:center;">
      ${imgHtml}
      <h2 style="margin-bottom:6px;">${escapeHtml(user.name || "Member")}</h2>
      <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(user.phone)}</p>
      <p><strong>Role:</strong> ${escapeHtml(user.role)}</p>
    </div>
  `;
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "login.html";
    };
  }
}

/* ---------- Utilities ---------- */
function escapeHtml(s) {
  if (!s) return "";
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/* ---------- Wire up forms when DOM loaded ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Register page form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegisterForm);

  // Login page form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLoginForm);

  // Profile page
  if (window.location.pathname.endsWith("profile.html")) {
    renderProfilePage();
  }
});
