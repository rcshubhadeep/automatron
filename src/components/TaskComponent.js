import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineClose, AiOutlineDelete, AiOutlinePlayCircle, AiOutlineEdit, AiOutlineCopy } from "react-icons/ai"; // Import the '+' and 'x' icons
import {getModels, runSimpleUserPrompt, getReplyString} from "../core/aiRunner";
import {getTasks, addTask, deleteTask, getTask, updateTask} from "../core/db";
import {applyTemplate} from "../core/templateEngine";
import {parseHandleBar} from '../core/handlebarParser';


function TaskComponent() {
    const [tasks, setTasks] = useState([]); // Example initial tasks
    const [showForm, setShowForm] = useState(false); // State to control the form display
    const [modelList, setModelList] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [modelName, setModelName] = useState("gpt-3.5 (least powerful)");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [showAltForm, setShowAltForm] = useState(false); // State to control the alternate form display
    const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task data
    const [inputFields, setInputFields] = useState({});
    const [llmResult, setLlmResult] = useState('');
    const [copySuccess, setCopySuccess] = useState('');


    // console.log(applyTemplate("My name is {{ name }}", {name: "SSS"}));
    
    const handleTaskClick = async (taskID, event) => {
        // setIsLoading(true); // Start loading
        const task = await getTask(taskID);
        // var prompt = applyTemplate(task.description, {name: "Shubhadeep"});
        // console.log(prompt);
        // console.log(task.model);
        // const result = await runSimpleUserPrompt(prompt, task.model);
        // console.log(getReplyString(result));
        setSelectedTask(task); // Set the selected task data
        setShowForm(false); // Hide the main form if it's showing
        setShowAltForm(true); // Show the alternate form
        const parsedTemplate = parseHandleBar(task.description);
        setInputFields(parsedTemplate);
        // setIsLoading(false); // Stop loading after the operation is complete
    };

    const handleInputChange = (key, value) => {
        setInputFields(prevFields => ({ ...prevFields, [key]: value }));
    };

    const processForm = async () => {
        setIsLoading(true);
        const prompt = applyTemplate(selectedTask.description, inputFields);
        const result = await runSimpleUserPrompt(prompt, selectedTask.model);
        if (result !== null){
            setLlmResult(getReplyString(result));
        } else {
            setLlmResult("Sorry! We faced a problem. Please try again later.");
        }
        setIsLoading(false);
        // Don't close the form here, so the result can be displayed
    };

    const copyResultToClipboard = () => {
        navigator.clipboard.writeText(llmResult).then(() => {
            setCopySuccess('Result copied to clipboard!');
            setTimeout(() => setCopySuccess(''), 3000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            setCopySuccess('Failed to copy the result.');
        });
    };

    const closeAltForm = () => {
        setShowAltForm(false);
        setSelectedTask(null);
        setInputFields({});
        setLlmResult(''); // Clear the result as well
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

    const handleEditTask = (task) => {
        setShowAltForm(false); // Added this line to clear the other form. DOES NOT WORK?!
        setShowForm(true); // Show the form to edit
        setEditingTaskId(task.id); // Set the task being edited
        // Pre-fill the form with task details
        setTaskName(task.taskName);
        setModelName(task.model);
        setDescription(task.description);
        
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const taskData = {
            taskName: taskName,
            model: modelName || "gpt-3.5 (least powerful)", // Default model if none selected
            description: description,
        };

        try {
            console.log(editingTaskId);
            // Update existing task
            if (editingTaskId) {
                await updateTask(editingTaskId, taskData);
            } else { // Add new task
                await addTask({ ...taskData, id: Date.now() }); // Include ID only for new tasks
            }

            // Fetch updated tasks list and reset form
            const tasksFromDB = await getTasks();
            setTasks(tasksFromDB);
            clearForm();
            setEditingTaskId(null); // Reset editing state
        } catch (error) {
            console.log(taskData);
            setErrorMessage(error.toString());
        }
    };

    useEffect(() => {
        async function getModelList() {
            const ml = await getModels();
            setModelList(ml);
            setModelName(ml[0]); // This does not persist. I am hardcoding above. Need to check
            console.log(modelName);
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
            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
                    <div className="spinner">Loading...</div> 
                </div>
            )}
            <button onClick={() => handleAddTask()} className="flex items-center justify-center p-4 bg-gray-200 rounded-full w-14 h-14">
                <AiOutlinePlus className="w-8 h-8 text-gray-600" />
            </button>
            <hr />
            <div className="flex gap-4"> {/* Added gap between columns */}
                <div className="w-1/2 space-y-2">
                {tasks.map((task) => (
                   <div key={task.id} className="flex justify-between items-center p-2 border bg-blue-500 hover:bg-blue-700 rounded-md text-white">
                        <button
                            className="text-left flex-1"
                        >
                            {task.taskName}
                        </button>
                        <div>
                            <button className="ml-4" onClick={(event) => handleTaskClick(task.id, event)}> {/* Add a Play button */}
                                <AiOutlinePlayCircle /> {/* Use the Play icon */}
                            </button>
                            <button className="ml-4" onClick={() => handleEditTask(task)}> {/* Add an Edit button */}
                                <AiOutlineEdit /> {/* Use the Edit icon */}
                            </button>
                            <button onClick={(event) => handleDeleteTask(task.id, event)} className="ml-4">
                                <AiOutlineDelete />
                            </button>
                        </div>
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
                                    value={modelName}
                                    onChange={(e) => {
                                        console.log("Select onChange triggered, new value:", e.target.value); // Debugging line
                                        setModelName(e.target.value);
                                    }}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                >
                                    {modelList.map((modelItem) => (
                                        <option key={modelItem} value={modelItem}>
                                            {modelItem}
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
                {showAltForm && (
                    <div className="w-1/2 p-4 bg-gray-100 rounded-lg relative">
                        <button onClick={() => closeAltForm()} className="absolute top-0 right-0 p-2">
                            <AiOutlineClose className="w-4 h-4 text-gray-600" />
                        </button>
                        <form className="space-y-4">
                            {Object.keys(inputFields).map((key) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                    <input
                                        type="text"
                                        value={inputFields[key]}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                                onClick={() => processForm()}
                            >
                                Submit
                            </button>
                        </form>
                        {llmResult && (
                            <>
                                <div className="mt-4 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
                                    <p className="whitespace-pre-wrap">{llmResult}</p>
                                </div>
                                <div className="mt-2 flex justify-center">
                                    <button
                                        onClick={copyResultToClipboard}
                                        className="p-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        aria-label="Copy result"
                                    >
                                        <AiOutlineCopy className="w-4 h-4 text-gray-600" /> {/* Assuming AiOutlineCopy is the correct icon */}
                                    </button>
                                </div>
                                {copySuccess && (
                                    <div className="text-sm text-center mt-1">{copySuccess}</div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskComponent;
