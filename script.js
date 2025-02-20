document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

const completedTasks = new Set();
let notificationSound = new Audio('https://www.fesliyanstudios.com/play-mp3/4386');
notificationSound.preload = "auto";

// Ensure sound is loaded but does NOT play on task addition
document.addEventListener('click', () => {
    notificationSound.muted = true; // Mute while unlocking
    notificationSound.play().then(() => {
        notificationSound.pause();
        notificationSound.currentTime = 0;
        notificationSound.muted = false; // Unmute after unlocking
    }).catch(() => {});
}, { once: true });

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
        completedTasks.add(taskId);
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
                if (Notification.permission === "granted") {
                    new Notification("Task Reminder", {
                        body: `Your task "${task.description}" is now due!`,
                        icon: 'https://via.placeholder.com/50'
                    });
                } else {
                    alert(`Your task "${task.description}" is now due!`);
                }
            }
        }, timeUntilDue);
    }
}

function playNotificationSound() {
    notificationSound.currentTime = 0; // Reset sound to start
    notificationSound.play().catch((error) => {
        console.warn("Autoplay blocked! Click anywhere to allow sound.");
    });
}
