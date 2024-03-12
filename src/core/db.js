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
