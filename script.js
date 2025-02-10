document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            console.log("Notification Permission:", permission);
        });
    }
});

// Handle task submission
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

// Add task to list
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

// Mark task as complete
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

// Store completed tasks to prevent notifications
const completedTasks = new Set();

// Schedule task notification
function scheduleNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();
    
    if (timeUntilDue > 0) {
        setTimeout(() => {
            if (!completedTasks.has(task.id)) { // Ensure notification for pending tasks only
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

// Fix notification sound issue
function playNotificationSound() {
    let sound = new Audio('https://www.myinstants.com/media/sounds/tindeck_1.mp3'); // Alternative sound
    sound.play().then(() => {
        console.log("Notification sound played.");
    }).catch(error => {
        console.warn("Sound playback blocked. Click anywhere on the page to allow.");
    });
}

// Enable sound on first user interaction (browser fix)
document.addEventListener('click', () => {
    let audio = new Audio('https://www.myinstants.com/media/sounds/tindeck_1.mp3');
    audio.play().then(() => {
        console.log("Audio unlocked after user interaction.");
    }).catch(() => {
        console.warn("User interaction required for sound.");
    });
}, { once: true });
