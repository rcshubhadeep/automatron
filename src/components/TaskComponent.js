import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineClose, AiOutlineDelete } from "react-icons/ai"; // Import the '+' and 'x' icons
import {getModels} from "../core/core";
import {getTasks, addTask, deleteTask} from "../core/db";
import {TemplateEngine} from "../core/templateEngine";

function TaskComponent() {
    const [tasks, setTasks] = useState(['Task 1', 'Task 2', 'Task 3', 'Task 4']); // Example initial tasks
    const [showForm, setShowForm] = useState(false); // State to control the form display
    const [modelList, setModelList] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [model, setModelName] = useState("");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    console.log(TemplateEngine("Please read the following <%name%>", {name: "Shubha"}));
    
    const handleTaskClick = (task) => {
        console.log(`${task} clicked`);
        // Other task click handling logic
    };

    const handleDeleteTask = async (taskIdToDelete) => {
        console.log(`Deleting task with ID: ${taskIdToDelete}`);
        await deleteTask(taskIdToDelete); // Delete the task from IndexedDB
        const tasksFromDB = await getTasks(); // Fetch the updated list of tasks
        setTasks(tasksFromDB); // Update state with the new list
    };

    const clearData = () => {
        setTaskName("");
        setModelName(""); // Make sure to correct the function name from setModelName to setModel
        setDescription("");
        setErrorMessage(""); // Clear any previous error messages
    }

    const handleAddTask = () => {
        setShowForm(true); // Only show the form
        // Optionally clear the form fields if needed
        clearData();
    };
    const clearForm = () => {
        setShowForm(false); // Close the form after submission
        clearData();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Assume you have state variables for each form input
        try{
            const newTask = {
                id: Date.now(), // or another method of generating unique IDs
                taskName: taskName,
                model: model,
                description: description,
            };
            await addTask(newTask);
            const tasksFromDB = await getTasks();
            setTasks(tasksFromDB);
            clearForm();
        } catch (error) {
            setErrorMessage(error.toString()); // Set the error message
        }
    };

    useEffect(() => {
        async function getModelList() {
            const ml = await getModels();
            setModelList(ml);
        }
        getModelList();
    }, [])

    useEffect(() => {
        async function fetchTasks() {
            const tasksFromDB = await getTasks();
            setTasks(tasksFromDB);
        }
        fetchTasks();
    }, []);

    return (
        <div className="space-y-4">
            <button onClick={() => handleAddTask()} className="flex items-center justify-center p-4 bg-gray-200 rounded-full w-14 h-14">
                <AiOutlinePlus className="w-8 h-8 text-gray-600" />
            </button>
            <hr />
            <div className="flex gap-4"> {/* Added gap between columns */}
                <div className="w-1/2 space-y-2">
                {tasks.map((task) => (
                    <div key={task.id} className="flex justify-between items-center p-2 border bg-blue-500 hover:bg-blue-700 rounded-md text-white">
                        <button
                            onClick={() => handleTaskClick(task.id)} // Assuming you want to handle click based on taskName
                            className="text-left flex-1"
                        >
                            {task.taskName} {/* Display the taskName from each task object */}
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="ml-4">
                            <AiOutlineDelete />
                        </button>
                    </div>
                ))}
                </div>
                {showForm && (
                    <div className="w-1/2 p-4 bg-gray-100 rounded-lg relative">
                        <button onClick={() => clearForm()} className="absolute top-0 right-0 p-2">
                            <AiOutlineClose className="w-4 h-4 text-gray-600" />
                        </button>
                        <form onSubmit={handleSubmit} className="space-y-4"> {/* Add a form tag and handle submission */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Task Name</label>
                                <input
                                    type="text"
                                    value={taskName} // Bind input to state variable
                                    onChange={(e) => setTaskName(e.target.value)} // Update state on change
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Model</label>
                                <select
                                    value={model} // Bind select to state variable
                                    onChange={(e) => setModelName(e.target.value)} // Update state on change
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                >
                                    {modelList.map((model) => (
                                        <option key={model} value={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">What do you want to do?</label>
                                <textarea
                                    value={description} // Bind textarea to state variable
                                    onChange={(e) => setDescription(e.target.value)} // Update state on change
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    style={{ height: '100px' }}
                                />
                            </div>
                            <button
                                type="submit" // Ensure button submits the form
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                            >
                                Submit
                            </button>
                        </form>
                        {errorMessage && (
                            <div className="text-red-500 text-sm p-2">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskComponent;
