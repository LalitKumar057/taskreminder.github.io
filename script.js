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

// Request Notification Permission on page load
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            console.log("Notification Permission:", permission);
        });
    }
});

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

// Ensuring Sound Plays
function playNotificationSound() {
    let sound = new Audio('https://www.soundjay.com/button/beep-07.wav'); // Use a valid sound URL
    sound.play().then(() => {
        console.log("Notification sound played.");
    }).catch(error => {
        console.warn("Sound playback blocked. Try clicking anywhere on the page first.");
    });
}

// Enable sound on first user interaction (browser fix)
document.addEventListener('click', () => {
    let audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
    audio.play().then(() => {
        console.log("Audio unlocked after user interaction.");
    }).catch(() => {
        console.warn("User interaction required for sound.");
    });
}, { once: true });
