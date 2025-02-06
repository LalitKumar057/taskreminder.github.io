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
