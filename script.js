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
        
        // Set notification for exact due time
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
        <small>Due: ${task.dueDate.toLocaleString()}</small>
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
        
        // Mark task as completed in local storage
        localStorage.setItem(`task-${taskId}-completed`, "true");
    }
}

function scheduleNotification(task) {
    // Check if the browser supports notifications
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                // Schedule notification
                setDueTimeNotification(task);
            }
        });
    } else {
        // If permission is already granted
        setDueTimeNotification(task);
    }
}

function setDueTimeNotification(task) {
    const timeUntilDue = task.dueDate.getTime() - Date.now();
    
    // If due time is in the future
    if (timeUntilDue > 0) {
        setTimeout(() => {
            // Check if the task was marked as complete before sending notification
            const isCompleted = localStorage.getItem(`task-${task.id}-completed`);
            if (!isCompleted) {
                new Notification("Task Reminder", {
                    body: `Your task "${task.description}" is now due!`,
                    icon: 'https://via.placeholder.com/50' // Optional: Use an icon
                });

                // Play notification sound
                playNotificationSound();
            }
        }, timeUntilDue);
    }
}

// Function to play a small notification sound
function playNotificationSound() {
    const audio = new Audio('https://www.soundjay.com/button/beep-07.wav'); // Use any beep sound URL
    audio.play();
}
