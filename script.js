document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript is working!");
    
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('dueDate');
    const taskList = document.getElementById('taskList');

    if (!taskForm || !taskInput || !dueDateInput || !taskList) {
        console.error("Error: One or more elements are missing.");
        return;
    }

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Handle task submission
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskDescription = taskInput.value.trim();
        const dueDate = new Date(dueDateInput.value);

        if (taskDescription && dueDateInput.value) {
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
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.innerHTML = `
            <span>${task.description} - ${task.dueDate.toLocaleString()}</span>
            <button onclick="markAsComplete(${task.id})">✔</button>
            <button onclick="deleteTask(${task.id})">✖</button>
        `;

        taskList.appendChild(li);
    }

    // Mark task as complete
    window.markAsComplete = function(taskId) {
        const taskItem = document.querySelector(`[data-id="${taskId}"]`);
        if (taskItem) {
            taskItem.classList.add('completed');
            completedTasks.add(taskId);
        }
    };

    // Delete task
    window.deleteTask = function(taskId) {
        const taskItem = document.querySelector(`[data-id="${taskId}"]`);
        if (taskItem) {
            taskItem.remove();
        }
    };

    // Store completed tasks to prevent notifications for them
    const completedTasks = new Set();

    // Schedule task notification
    function scheduleNotification(task) {
        const timeUntilDue = task.dueDate.getTime() - Date.now();

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

    // Notification Sound
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
});
