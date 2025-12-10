// Open Login Popup
function openLogin() {
  Swal.fire({
    title: 'Login',
    html: `
      <input id="login-email" type="email" class="swal2-input" placeholder="Email">
      <input id="login-pass" type="password" class="swal2-input" placeholder="Password">
    `,
    confirmButtonText: 'Login',
    preConfirm: () => {
      let email = document.getElementById("login-email").value;
      let pass = document.getElementById("login-pass").value;

      if (!email || !pass) {
        Swal.showValidationMessage("All fields are required");
        return false;
      }

      Swal.fire("Success!", "Login successful", "success");
    }
  });
}

// Open Signup Popup
function openSignup() {
  Swal.fire({
    title: 'Create Account',
    html: `
      <input id="reg-name" type="text" class="swal2-input" placeholder="Full Name">
      <input id="reg-email" type="email" class="swal2-input" placeholder="Email">
      <input id="reg-phone" type="tel" class="swal2-input" placeholder="Phone Number">
      <input id="reg-pass" type="password" class="swal2-input" placeholder="Password">
    `,
    confirmButtonText: 'Register',
    preConfirm: () => {
      let name = document.getElementById("reg-name").value;
      let email = document.getElementById("reg-email").value;
      let phone = document.getElementById("reg-phone").value;
      let pass = document.getElementById("reg-pass").value;

      if (!name || !email || !phone || !pass) {
        Swal.showValidationMessage("All fields are required");
        return false;
      }

      Swal.fire(
        "Registration Successful!",
        "Thank you for joining the Prekebena Dynasty.",
        "success"
      );
    }
  });
}
