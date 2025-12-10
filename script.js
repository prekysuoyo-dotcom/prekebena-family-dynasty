document.addEventListener("DOMContentLoaded", () => {

    // Registration
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("action", "register");
            formData.append("name", document.getElementById("name").value);
            formData.append("email", document.getElementById("email").value);
            formData.append("phone", document.getElementById("phone").value);
            formData.append("password", document.getElementById("password").value);

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            const result = await response.text();

            if (result.includes("successful")) {
                alert("Registration successful!\nAn email has been sent to you.\nThank you for joining the Prekebena Family Dynasty.");
                window.location.href = "login.html";
            } else {
                alert("Error: Something went wrong. Please try again.");
            }
        });
    }

    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("action", "login");
            formData.append("email", document.getElementById("loginEmail").value);
            formData.append("password", document.getElementById("loginPassword").value);

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.status === "success") {

                if (data.role === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "member.html";
                }

            } else {
                alert("Incorrect email or password. Please try again.");
            }
        });
    }

});
