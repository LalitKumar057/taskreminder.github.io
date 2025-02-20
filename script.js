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
        ${task.description} - ${task.dueDate.toLocaleString()}
        <button onclick="markAsComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">✖</button>
    `;

    taskList.appendChild(li);
}

function markAsComplete(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.classList.add('completed');
        completedTasks.add(taskId); // Prevent notifications for completed tasks
    }
}

function deleteTask(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.remove();
        completedTasks.delete(taskId); // Remove from completed list
    }
}

// Store completed tasks to prevent notifications
const completedTasks = new Set();

// Request Notification Permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function scheduleNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();

    if (timeUntilDue > 0) {
        setTimeout(() => {
            if (!completedTasks.has(task.id)) { // Ensure notification only for pending tasks
                playNotificationSound();
                new Notification("Task Reminder", {
                    body: `Your task "${task.description}" is now due!`,
                    icon: 'https://via.placeholder.com/50'
                });
            }
        }, timeUntilDue);
    }
}

// 🔊 Working Notification Sound
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
