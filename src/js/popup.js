async function getLogin(email, password) {
    const errorMessage = document.getElementById("error-message");
    
    const requestBody = {
        email,
        password,
    };

    try {
        const res = await fetch("http://localhost:4000/api/v1/users/login", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            errorMessage.textContent = "Invalid Email or Password";
            return;
        }

        const data = await res.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent = "Unexpected error occured."   
        }
    } catch (error) {
       errorMessage.textContent = "Internal server error."; 
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = "dashboard.html";
    } else {
        const loginForm = document.getElementById("login-form");

        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
    
            const email = document.querySelector("input[type='email']").value;
            const password = document.querySelector("input[type='password']").value;
    
            await getLogin(email, password);
        });
    }
});
