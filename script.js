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
            dueDate: dueDate.getTime(),  // Store as timestamp
            completed: false
        };

        addTaskToList(task);
        scheduleNotification(task); // Only schedule, no immediate sound

        taskInput.value = '';
        dueDateInput.value = '';
    }
});

function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        ${task.description} - ${new Date(task.dueDate).toLocaleString()} 
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

// Store completed tasks to prevent notifications
const completedTasks = new Set();

// Request Notification Permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function scheduleNotification(task) {
    const timeUntilDue = task.dueDate - Date.now(); // Time left in ms

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

// 🔊 Notification Sound (Only plays at due time)
let audio = new Audio('https://www.fesliyanstudios.com/play-mp3/4386');

function playNotificationSound() {
    audio.currentTime = 0;
    audio.play().catch(error => {
        console.warn("Autoplay blocked! Click anywhere to allow sound.");
    });
}

// Enable sound on user interaction
document.addEventListener('click', () => {
    audio.play().catch(() => {
        console.warn("Click detected, but still blocked.");
    });
}, { once: true });
