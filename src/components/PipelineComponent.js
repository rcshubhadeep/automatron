import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"; // Import the '+' and 'x' icons
import {getModels} from "../core/aiRunner"

function PipelineComponent() {
  // Example list of pipelines. You might fetch these from a backend or state.
  const pipelines = ['Pipeline 1', 'Pipeline 2', 'Pipeline 3', 'Pipeline 4'];
  const [showForm, setShowForm] = useState(false);
  const [modelList, setModelList] = useState([]);

  // Function to handle clicks on a pipeline. You can customize this function as needed.
  const handlePipelineClick = (pipeline) => {
    console.log(`${pipeline} clicked`);
    // Perform actions here, such as navigating to a pipeline detail page or displaying pipeline details.
  };

    //   const modelList = getModels();
    useEffect(() => {
        async function getModelList() {
            const ml = await getModels();
            setModelList(ml);
        }
        getModelList();
    }, [])
    // console.log(modelList);
  return (
    <div className="space-y-4">
            <button onClick={() => setShowForm(true)} className="flex items-center justify-center p-4 bg-gray-200 rounded-full w-14 h-14">
                <AiOutlinePlus className="w-8 h-8 text-gray-600" />
            </button>
            <hr />
            <div className="flex gap-4"> {/* Added gap between columns */}
                <div className="w-1/2 space-y-2">
                    {pipelines.map((task, index) => (
                        <button
                            key={index}
                            onClick={() => handlePipelineClick(task)}
                            className="block w-full p-2 border bg-blue-500 hover:bg-blue-700 rounded-md text-left text-white"
                        >
                            {task}
                        </button>
                    ))}
                </div>
                {showForm && (
                    <div className="w-1/2 p-4 bg-gray-100 rounded-lg relative"> {/* Padded and rounded for aesthetics */}
                        <button onClick={() => setShowForm(false)} className="absolute top-0 right-0 p-2">
                            <AiOutlineClose className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Task Name</label>
                                <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Model</label>
                                <select className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                                    {modelList.map((model, index) => (
                                        <option key={model} value={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">What do you want to do?</label>
                                <textarea className="mt-1 p-2 w-full border border-gray-300 rounded-md" style={{ height: '100px' }} />
                            </div>
                            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
  )
}

export default PipelineComponent;
