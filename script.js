document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

const completedTasks = new Set();
let notificationSound = new Audio('https://www.fesliyanstudios.com/play-mp3/4386');
notificationSound.preload = "auto"; // Preload sound but do not play

document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');

    const taskDescription = taskInput.value.trim();
    const dueDate = new Date(dueDateInput.value);

    if (taskDescription && dueDateInput.value) {
        const task = {
            id: Date.now(),
            description: taskDescription,
            dueDate: dueDate,
            completed: false
        };

        addTaskToList(task);
        scheduleNotification(task);

        taskInput.value = '';
        dueDateInput.value = '';
    }
});

function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        <span>${task.description} - ${task.dueDate.toLocaleString()}</span>
        <button onclick="markAsComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">✖</button>
    `;
    
    taskList.appendChild(li);
}

function markAsComplete(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.classList.add('completed');
        completedTasks.add(taskId); // Add to completed tasks
    }
}

function deleteTask(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.remove();
        completedTasks.delete(taskId);
    }
}

function scheduleNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();

    if (timeUntilDue > 0) {
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
}

function playNotificationSound() {
    notificationSound.play().catch(error => {
        console.warn("Autoplay blocked! Click anywhere to allow sound.");
    });
}
