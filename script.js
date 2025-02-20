document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded"); // Debugging log

    const taskForm = document.getElementById('taskForm');
    if (!taskForm) {
        console.error("Error: taskForm element not found!");
        return;
    }

    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            console.log("Notification Permission:", permission);
        });
    }
});

// Store completed tasks to prevent duplicate notifications
const completedTasks = new Set();

// Handle task submission
document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    console.log("Form Submitted"); // Debugging log

    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');

    if (!taskInput || !dueDateInput) {
        console.error("Error: Task input or due date input not found!");
        return;
    }

    const taskDescription = taskInput.value.trim();
    const dueDateValue = dueDateInput.value.trim();

    if (!taskDescription || !dueDateValue) {
        alert("Please enter a valid task and due date.");
        return;
    }

    const dueDate = new Date(dueDateValue);

    const task = {
        id: Date.now(),
        description: taskDescription,
        dueDate: dueDate,
        completed: false
    };

    console.log("Adding task:", task); // Debugging log

    addTaskToList(task);
    scheduleNotification(task);

    taskInput.value = '';
    dueDateInput.value = '';
});

// Add task to list
function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    if (!taskList) {
        console.error("Error: taskList element not found!");
        return;
    }

    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        ${task.description} - ${task.dueDate.toLocaleString()}
        <button onclick="markAsComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">✖</button>
    `;

    taskList.appendChild(li);
}

// Mark task as complete
function markAsComplete(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (!taskItem) {
        console.error(`Error: Task with ID ${taskId} not found!`);
        return;
    }

    taskItem.classList.add('completed');
    completedTasks.add(taskId);
}

// Delete task
function deleteTask(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (!taskItem) {
        console.error(`Error: Task with ID ${taskId} not found!`);
        return;
    }

    taskItem.remove();
}

// Schedule task notification
function scheduleNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();

    if (timeUntilDue <= 0) {
        alert(`Task "${task.description}" is already due or has an invalid time.`);
        return;
    }

    console.log(`Notification scheduled in ${timeUntilDue / 1000} seconds for task:`, task);

    setTimeout(() => {
        if (!completedTasks.has(task.id)) {
            playNotificationSound();
            new Notification("Task Reminder", {
                body: `Your task "${task.description}" is now due!`,
                icon: 'https://via.placeholder.com/50'
            });
        }
    }, timeUntilDue);
}

// 🔊 Working Notification Sound Link
let audio = new Audio('https://www.fesliyanstudios.com/play-mp3/4386');

function playNotificationSound() {
    audio.play().catch(error => {
        console.warn("Autoplay blocked! Click anywhere to allow sound.");
    });
}

// Enable sound on user interaction (fix autoplay issue)
document.addEventListener('click', () => {
    audio.play().catch(() => {
        console.warn("Click detected, but still blocked.");
    });
}, { once: true });

