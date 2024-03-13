import React, { useState, useEffect } from 'react';
import { SiAzurepipelines, SiTask } from "react-icons/si";
import { GoGear } from "react-icons/go";
import SettingsComponent from './SettingsComponent';
import PipelineComponent from './PipelineComponent';
import TaskComponent from './TaskComponent';
import {getAPIKey} from '../core/core'; 

function MainComponent() {
  const [activeSection, setActiveSection] = useState('Pipelines');
  const [apiKeyExists, setApiKeyExists] = useState(true);

  const updateApiKeyPresence = (presence) => {
    setApiKeyExists(presence);
  };

  useEffect(() => {
    const apiKey = getAPIKey();
    setApiKeyExists(apiKey !== null);
  }, []);

  const isActive = (sectionName) => activeSection === sectionName ? 'bg-gray-200 dark:bg-gray-700' : '';

  return (
    <div className="flex">
      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <button onClick={() => setActiveSection('Pipelines')} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('Pipelines')}`}>
                <SiAzurepipelines className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Pipelines</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('Tasks')} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('Tasks')}`}>
                <SiTask className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">Tasks</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('Settings')} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('Settings')}`}>
                <GoGear className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64 w-full">
      {!apiKeyExists && (
          <div className="bg-red-500 text-white p-4 rounded-lg">
            <h2 className="text-lg">API Key Missing</h2>
            <p>Please set your API key in the Settings.</p>
          </div>
        )}

        {activeSection === 'Settings' && <SettingsComponent updateApiKeyPresence={updateApiKeyPresence} />}
        {activeSection === 'Pipelines' && <PipelineComponent />}
        {activeSection === 'Tasks' && <TaskComponent />}
      </div>
    </div>
  )
}

export default MainComponent;
