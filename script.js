document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            console.log("Notification Permission:", permission);
        });
    }
});

// Store completed tasks persistently
const completedTasks = new Set(JSON.parse(localStorage.getItem('completedTasks')) || []);

// Handle task submission
document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');

    const taskDescription = taskInput.value;
    const dueDate = new Date(dueDateInput.value);

    if (!taskDescription || isNaN(dueDate.getTime())) {
        alert("Please enter a valid task and due date.");
        return;
    }

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
        localStorage.setItem('completedTasks', JSON.stringify([...completedTasks])); // Save persistently
    }
}

// Schedule task notification
function scheduleNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();

    if (timeUntilDue <= 0) {
        alert(`Task "${task.description}" is already due or has an invalid time.`);
        return;
    }

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

// Fix notification sound issue
function playNotificationSound() {
    const sound = new Audio('https://www.myinstants.com/media/sounds/tindeck_1.mp3');
    sound.play().then(() => {
        console.log("Notification sound played.");
    }).catch(error => {
        console.warn("Sound playback blocked. Click anywhere on the page to allow.");
    });
}

// Enable sound on first user interaction
const notificationSound = new Audio('https://www.myinstants.com/media/sounds/tindeck_1.mp3');
document.addEventListener('click', () => notificationSound.play(), { once: true });
