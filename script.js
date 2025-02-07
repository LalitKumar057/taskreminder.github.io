document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');
    
    const taskDescription = taskInput.value;
    const dueDate = new Date(dueDateInput.value);

    if (taskDescription && dueDate) {
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
        <span>${task.description}</span>
        <br>
        <small class="task-time">Due: ${task.dueDate.toLocaleString()}</small>
        <button onclick="markAsComplete(${task.id})">Mark as Complete</button>
    `;
    
    taskList.appendChild(li);
}

function markAsComplete(taskId) {
    const taskList = document.getElementById('taskList');
    const taskItem = taskList.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.classList.add('completed');
        taskItem.querySelector('button').disabled = true;

        // Store completion status
        completedTasks.add(taskId);
    }
}

// Store completed tasks to prevent unnecessary alerts
const completedTasks = new Set();

// Request Notification Permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function scheduleNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();
    
    if (timeUntilDue > 0) {
        setTimeout(() => {
            if (!completedTasks.has(task.id)) { // Ensure notification for pending tasks only
                playNotificationSound();
                new Notification("Task Reminder", {
                    body: `Your task "${task.description}" is now due!`,
                    icon: 'https://via.placeholder.com/50'
                });
            }
        }, timeUntilDue);
    }
}

// Ensuring Sound Works Even with Browser Restrictions
let audio = new Audio('https://www.soundjay.com/button/beep-07.wav'); // Replace with your sound file

// Play sound when due
function playNotificationSound() {
    audio.play().catch(error => {
        console.warn("Autoplay blocked! Click anywhere to allow sound.");
    });
}

// Enable sound on user interaction (browser workaround)
document.addEventListener('click', () => {
    audio.play().catch(() => {
        console.warn("Click detected, but still blocked.");
    });
}, { once: true });
