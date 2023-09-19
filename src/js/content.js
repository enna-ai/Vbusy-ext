const todaysDate = document.getElementById("date");
const currentDate = new Date();

const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");

const formatDate = `${month}/${day}`;
todaysDate.textContent = formatDate;

async function getTasks() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token not found in localStorage.");
        return;
    }

    try {
        const res = await fetch("http://localhost:4000/api/v1/tasks", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) {
            throw new Error(`Fetch request failed with status code ${res.status}`);
        }

        const data = await res.json();
        const taskList = document.getElementById("tasks");

        taskList.innerHTML = "";

        data.forEach((task) => {
            const listItem = document.createElement("li");
            listItem.textContent = task.task;
            taskList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

async function handleLogout() {
    try {
        await fetch("http://localhost:4000/api/v1/users/logout", {
            method: "POST",
        });

        localStorage.removeItem("token");

        window.location.href = "popup.html";
        chrome.extension.getViews({ type: "popup" })[0].close();
    } catch (error) {
        console.error("Logout failed with error:", error.message);
    }
}

document.addEventListener("DOMContentLoaded", getTasks());
document.getElementById("logout-btn").addEventListener("click", handleLogout);