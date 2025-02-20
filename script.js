document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

const completedTasks = new Set();
let notificationSound = new Audio('https://www.fesliyanstudios.com/play-mp3/4386');

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

// Add task to list
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

// Mark task as complete
function markAsComplete(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.classList.add('completed');
        completedTasks.add(taskId);
    }
}

// Delete task
function deleteTask(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.remove();
        completedTasks.delete(taskId);
    }
}

// Schedule task notification
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

// Play notification sound **ONLY when task is due**
function playNotificationSound() {
    notificationSound.play().catch((error) => {
        console.warn("Autoplay blocked! Click anywhere to allow sound.");
    });
}

// 🚨 FIX: Remove autoplay issue when clicking the page
document.addEventListener('click', () => {
    notificationSound.play().then(() => {
        notificationSound.pause();
        notificationSound.currentTime = 0; // Stop sound after playing once
    }).catch(() => {});
}, { once: true });
