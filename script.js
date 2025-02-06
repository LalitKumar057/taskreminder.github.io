function scheduleNotification(task) {
    // Real reminder logic: Notify the user based on the chosen reminder time
    const reminderTime = task.dueDate.getTime() - Date.now() - task.reminderTime;

    if (reminderTime > 0) {
        // Reminder before due time
        setTimeout(function () {
            new Notification(`Reminder: Your task "${task.description}" is due soon!`, {
                body: `Due at: ${task.dueDate.toLocaleString()}`,
                icon: 'https://via.placeholder.com/50'
            });
        }, reminderTime);
    }

    // Check if the task is overdue and send an "overdue" notification
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
