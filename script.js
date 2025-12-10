const API_URL = "https://script.google.com/macros/s/AKfycbw3b-ldsgd7J6m8XGnD0ZPp-H_hpi-jYtg3Ay1s51Qbrlu2jY8FAWvALIz6MvYdAXWo/exec";

/* ---------------- REGISTRATION ---------------- */
if (document.getElementById("registerForm")) {
    document.getElementById("registerForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            action: "register",
            fullname: document.getElementById("fullname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            password: document.getElementById("password").value,
        };

        let res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(data),
        });

        let result = await res.json();

        if (result.status === "success") {
            Swal.fire("Success!", "Registration completed.", "success");
            setTimeout(() => window.location.href = "login.html", 1500);
        } else {
            Swal.fire("Error", result.message, "error");
        }
    });
}


/* ---------------- LOGIN ---------------- */
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            action: "login",
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        let res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(data),
        });

        let result = await res.json();

        if (result.status === "success") {
            localStorage.setItem("user", JSON.stringify(result.user));
            window.location.href = "profile.html";
        } else {
            Swal.fire("Login Failed", result.message, "error");
        }
    });
}


/* ---------------- PROFILE PAGE ---------------- */
if (window.location.pathname.includes("profile.html")) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
    } else {
        document.getElementById("p_name").innerText = user.fullname;
        document.getElementById("p_email").innerText = user.email;
        document.getElementById("p_phone").innerText = user.phone;
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
}
