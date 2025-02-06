// Listen for form submission to add a new task
document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get task and due date from the form
    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');

    const taskDescription = taskInput.value;
    const dueDate = new Date(dueDateInput.value);

    // Make sure both fields have values
    if (taskDescription && dueDate) {
        // Create a task object
        const task = {
            id: Date.now(),
            description: taskDescription,
            dueDate: dueDate,
            completed: false,
            reminderTime: 5 * 60 * 1000 // Default to 5 minutes before due date
        };

        // Add task to the list in the UI
        addTaskToList(task);

        // Set reminder for the task
        setReminder(task);

        // Clear input fields after task is added
        taskInput.value = '';
        dueDateInput.value = '';
    }
});

// Function to add task to the HTML list
function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
        <span>${task.description}</span>
        <br>
        <small>Due: ${task.dueDate.toLocaleString()}</small>
        <button onclick="markAsComplete(${task.id})">Mark as Complete</button>
    `;

    taskList.appendChild(li);
}

// Function to mark task as complete
function markAsComplete(taskId) {
    const taskList = document.getElementById('taskList');
    const taskItem = taskList.querySelector(`[data-id="${taskId}"]`);
    taskItem.classList.add('completed');
    taskItem.querySelector('button').disabled = true;
}

// Function to handle setting reminders and notifications
function setReminder(task) {
    // Check if browser supports notifications
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                scheduleNotification(task);
            }
        });
    } else {
        // If permission is granted, schedule notifications
        scheduleNotification(task);
    }
}

// Function to schedule notifications based on reminder time and due date
function scheduleNotification(task) {
    // Calculate the time for the reminder (e.g., 5 minutes before)
    const reminderTime = task.dueDate.getTime() - Date.now() - task.reminderTime;

    if (reminderTime > 0) {
        // Send reminder before due date
        setTimeout(function () {
            new Notification(`Reminder: Your task "${task.description}" is due soon!`, {
                body: `Due at: ${task.dueDate.toLocaleString()}`,
                icon: 'https://via.placeholder.com/50'
            });
        }, reminderTime);
    }

    // Check if the task is overdue and send an overdue notification
    const overdueTime = task.dueDate.getTime() - Date.now();

    if (overdueTime < 0) {
        // Task is overdue, send an overdue notification immediately
        setTimeout(function () {
            new Notification(`Task Overdue: "${task.description}"`, {
                body: `The task was due at: ${task.dueDate.toLocaleString()}. Please complete it as soon as possible.`,
                icon: 'https://via.placeholder.com/50'
            });
        }, 0); // Send notification immediately if overdue
    }
}

// Request permission for notifications on page load
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}
