const todaysDate = document.getElementById("date");
const currentDate = new Date();

const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");

const formatDate = `${month}/${day}`;
todaysDate.textContent = formatDate;

const token = localStorage.getItem("token");

async function getUser() {
    try {
        const res = await fetch("http://localhost:4000/api/v1/users/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const user = await res.json();

        const username = document.getElementById("username");
        username.textContent = `@${user.username}`;
    } catch (error) {
        console.error(error);
    }
}

getUser();

async function getTasks() {
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
        const taskList = document.getElementById("taskList");

        taskList.innerHTML = "";

        data.forEach((task) => {
            const listItem = document.createElement("li");
            listItem.setAttribute("data-task-id", task._id);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const taskItem = document.createElement("span");
            taskItem.textContent = task.task;

            if (task.completed) {
                listItem.classList.add("completed");
            }

            checkbox.addEventListener("change", () => {
                const taskId = listItem.getAttribute("data-task-id");
                completeTask(taskId);
            });

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            deleteButton.addEventListener("click", () => {
                const taskId = listItem.getAttribute("data-task-id");
                deleteTask(taskId);
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(taskItem);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

async function completeTask(taskId) {
    try {
        const res = await fetch(`http://localhost:4000/api/v1/tasks/${taskId}/complete`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (res.ok) {
            const taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
            taskItem.classList.toggle("completed");
        } else {
            console.error("Failed to toggle a task status");
        }
    } catch (error) {
        console.error("An error occured trying to toggle a task as complete");
    }
}

async function deleteTask(taskId) {
    try {
        const res = await fetch(`http://localhost:4000/api/v1/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to delete task with status code ${res.status}`);
        }

        getTasks();
    } catch (error) {
        console.error("An error occured trying to delete a task", error.message);
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