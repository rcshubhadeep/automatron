const dbName = "automatron";
const taskStoreName = "tasks";

// Open the database
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(taskStoreName)) {
                const objectStore = db.createObjectStore(taskStoreName, { autoIncrement: true });
                objectStore.createIndex("taskName", "taskName", { unique: true }); // Create a unique index on taskName
            }
        };

        request.onerror = (event) => reject(`Database error: ${event.target.errorCode}`);

        request.onsuccess = (event) => resolve(event.target.result);
    });
}

// Get all tasks
// Adjusting getTasks to include IDs
export async function getTasks() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([taskStoreName], "readonly");
        const objectStore = transaction.objectStore(taskStoreName);
        const request = objectStore.openCursor(); // Use a cursor to iterate through items
        const tasks = [];

        request.onerror = (event) => reject(`Get tasks error: ${event.target.errorCode}`);

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const task = cursor.value;
                task.id = cursor.key; // Assign the key as the id property of the task object
                tasks.push(task);
                cursor.continue();
            } else {
                resolve(tasks); // Return the array of tasks with their IDs
            }
        };
    });
}


// Add a new task with a unique name check
export async function addTask(task) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([taskStoreName], "readonly");
        const objectStore = transaction.objectStore(taskStoreName);
        const index = objectStore.index("taskName"); // Assuming you have an index on taskName
        const request = index.get(task.taskName);

        request.onerror = (event) => reject(`Error checking for existing task name: ${event.target.errorCode}`);

        request.onsuccess = (event) => {
            const matchingTask = event.target.result;
            if (matchingTask) {
                reject('Task with the same name already exists');
            } else {
                // If no matching task name is found, add the new task
                const addTransaction = db.transaction([taskStoreName], "readwrite");
                const addObjectStore = addTransaction.objectStore(taskStoreName);
                const addRequest = addObjectStore.add(task);
                addRequest.onerror = (event) => reject(`Add task error: ${event.target.errorCode}`);
                addRequest.onsuccess = () => resolve();
            }
        };
    });
}


export async function updateTask(taskId, updatedTask) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([taskStoreName], "readwrite");
        const objectStore = transaction.objectStore(taskStoreName);
        
        // First, get the current task to see if the name is being changed.
        const getRequest = objectStore.get(taskId);
        getRequest.onerror = () => reject("Error fetching the task to update.");

        getRequest.onsuccess = () => {
            const existingTask = getRequest.result;
            if (!existingTask) return reject("Task not found.");

            // If the task name hasn't changed or is empty, proceed with the update.
            if (updatedTask.taskName === existingTask.taskName || !updatedTask.taskName) {
                const updateRequest = objectStore.put({ ...updatedTask, id: taskId });
                updateRequest.onerror = (event) => reject(`Update task error: ${event.target.error.message}`);
                updateRequest.onsuccess = () => resolve();
            } else {
                // Check if another task with the new name already exists.
                const index = objectStore.index("taskName");
                const nameCheckRequest = index.get(updatedTask.taskName);
                nameCheckRequest.onerror = () => reject("Error checking task name uniqueness.");

                nameCheckRequest.onsuccess = () => {
                    const conflictingTask = nameCheckRequest.result;
                    if (conflictingTask && conflictingTask.id !== taskId) {
                        reject("Task name must be unique.");
                    } else {
                        // No conflict, or it's the same task, proceed with the update.
                        const updateRequest = objectStore.put({ ...updatedTask, id: taskId });
                        updateRequest.onerror = (event) => reject(`Update task error: ${event.target.error.message}`);
                        updateRequest.onsuccess = () => resolve();
                    }
                };
            }
        };
    });
}



// Delete a task
export async function deleteTask(taskId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([taskStoreName], "readwrite");
        const objectStore = transaction.objectStore(taskStoreName);
        const request = objectStore.delete(taskId);

        request.onerror = (event) => reject(`Delete task error: ${event.target.errorCode}`);

        request.onsuccess = () => resolve();
    });
}


export async function getTask(taskId) {
    const db = await openDB(); // Assume openDB is a function that opens a connection to your IndexedDB
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([taskStoreName], "readonly"); // Use "readonly" mode since you're only reading data
        const objectStore = transaction.objectStore(taskStoreName);
        const request = objectStore.get(taskId); // Use the 'get' method to retrieve a task by its ID

        request.onerror = (event) => {
            // Handle any errors that occur during the transaction
            reject(`Get task error: ${event.target.errorCode}`);
        };

        request.onsuccess = () => {
            // Check if the task was found (request.result will be undefined if not found)
            if (request.result) {
                resolve(request.result); // Return the found task object
            } else {
                resolve(null); // Return null if the task wasn't found
            }
        };
    });
}

