document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            console.log("Notification Permission:", permission);
        });
    }
});

// Store completed tasks
const completedTasks = new Set(JSON.parse(localStorage.getItem('completedTasks')) || []);

// Handle task submission
document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');

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
        ${task.description} - ${task.dueDate.toLocaleString()}
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
        localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
    }
}

// Delete task
function deleteTask(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    if (taskItem) {
        taskItem.remove();
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
