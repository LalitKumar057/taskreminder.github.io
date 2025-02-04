document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get task and due date
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
                // Notify if permission is granted
                scheduleNotification(task);
            }
        });
    } else {
        // If permission is already granted
        scheduleNotification(task);
    }
}

// Function to handle notification logic
function scheduleNotification(task) {
    // Immediate notification for testing (1 second after task creation)
    setTimeout(function () {
        new Notification(`Task Reminder: "${task.description}"`, {
            body: `Due: ${task.dueDate.toLocaleString()}`,
            icon: 'https://via.placeholder.com/50' // Optional: Use an icon
        });
    }, 1000); // Test notification after 1 second

    // Real reminder logic: Notify 5 minutes before the due time
    const reminderTime = task.dueDate.getTime() - Date.now() - 5 * 60 * 1000; // 5 minutes before due time

    // If reminder time is in the future
    if (reminderTime > 0) {
        setTimeout(function () {
            new Notification(`Reminder: Your task "${task.description}" is due soon!`, {
                body: `Due at: ${task.dueDate.toLocaleString()}`,
                icon: 'https://via.placeholder.com/50' // Optional: Use an icon
            });
        }, reminderTime);
    }
}
