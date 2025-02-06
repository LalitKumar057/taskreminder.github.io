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
        
        // Set reminder
        setReminder(task);
        
        // Clear input fields
        taskInput.value = '';
        dueDateInput.value = '';
    }
});

function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    
    // Create a new list item
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);

    // Insert task description and due date
    li.innerHTML = `
        <span>${task.description}</span><br>
        <small>Due: ${task.dueDate.toLocaleString()}</small><br>
        <button onclick="markAsComplete(${task.id})">Mark as Complete</button>
    `;

    // Append the task item to the task list
    taskList.appendChild(li);
}

function markAsComplete(taskId) {
    const taskList = document.getElementById('taskList');
    const taskItem = taskList.querySelector(`[data-id="${taskId}"]`);
    taskItem.classList.add('completed');
    taskItem.querySelector('button').disabled = true;
}

function setReminder(task) {
    // Check if the browser supports notifications
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                scheduleNotification(task);
            }
        });
    } else {
        scheduleNotification(task);
    }
}

// Function to handle notification logic
function scheduleNotification(task) {
    // Calculate reminder time: 5 minutes before due time
    const reminderTime = task.dueDate.getTime() - Date.now() - 5 * 60 * 1000;

    if (reminderTime > 0) {
        // Set a timeout to show reminder 5 minutes before due time
        setTimeout(function () {
            new Notification(`Reminder: Your task "${task.description}" is due soon!`, {
                body: `Due at: ${task.dueDate.toLocaleString()}`,
                icon: 'https://via.placeholder.com/50'
            });
        }, reminderTime);
    }

    // If the task is overdue, notify immediately
    const overdueTime = task.dueDate.getTime() - Date.now();
    if (overdueTime < 0) {
        setTimeout(function () {
            new Notification(`Task Overdue: "${task.description}"`, {
                body: `The task was due at: ${task.dueDate.toLocaleString()}. Please complete it ASAP.`,
                icon: 'https://via.placeholder.com/50'
            });
        }, 0);  // Send overdue notification immediately
    }
}
