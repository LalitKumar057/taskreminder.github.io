document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get task description and due date
    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');

    const taskDescription = taskInput.value;
    const dueDate = new Date(dueDateInput.value);

    if (taskDescription && dueDate) {
        // Create task object
        const task = {
            id: Date.now(),
            description: taskDescription,
            dueDate: dueDate,
            completed: false
        };

        // Add task to the list
        addTaskToList(task);

        // Schedule notification
        scheduleNotification(task);

        // Clear input fields
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

        // Save completion status
        localStorage.setItem(`task-${taskId}-completed`, "true");
    }
}

function scheduleNotification(task) {
    // Request notification permission if not granted
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                setDueTimeNotification(task);
            }
        });
    } else {
        setDueTimeNotification(task);
    }
}

function setDueTimeNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();

    if (timeUntilDue > 0) {
        setTimeout(() => {
            // Check if task is already completed
            const isCompleted = localStorage.getItem(`task-${task.id}-completed`);
            if (!isCompleted) {
                // Show notification
                new Notification("Task Reminder", {
                    body: `Your task "${task.description}" is now due!`,
                    icon: 'https://via.placeholder.com/50'
                });

                // Play notification sound
                playNotificationSound();
            }
        }, timeUntilDue);
    }
}

function playNotificationSound() {
    const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
    audio.play();
}
