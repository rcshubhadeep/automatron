import React, { useState, useEffect } from 'react';
import { getAPIKey, deleteAPIKey, saveAPIKey } from '../core/storage';

function SettingsComponent({ updateApiKeyPresence }) {
  const [displayedApiKey, setDisplayedApiKey] = useState(''); // State for the displayed value
  const [actualApiKey, setActualApiKey] = useState(''); // State for the actual API key value
  const [isSaved, setIsSaved] = useState(false); // State to track save status

  useEffect(() => {
    // Load the API key and set it to the displayedApiKey when the component mounts
    (async () => {
      const key = await getAPIKey();
      if (key) {
        setDisplayedApiKey('••••••••'); // Display dots to hide the actual key
        setActualApiKey(key); // Store the actual key
      }
    })();
  }, []);

  const handleSave = async () => {
    await saveAPIKey(actualApiKey);
    setDisplayedApiKey('••••••••');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    updateApiKeyPresence(true);
  };

  const handleInputChange = (e) => {
    setActualApiKey(e.target.value);
    setDisplayedApiKey(e.target.value.replace(/./g, '•')); // Replace each character with a dot
  };

  const handleDeleteApiKey = async () => {
    await deleteAPIKey();
    setActualApiKey('');
    setDisplayedApiKey('');
    updateApiKeyPresence(false); // API key is removed, so banner should show
  };

  return (
    <div className="p-4">
      <label htmlFor="api-key" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        OpenAI API Key
      </label>
      <div className="flex">
        <input
          type="text"
          id="api-key"
          className="border border-gray-300 p-2 rounded-lg text-sm flex-1"
          value={displayedApiKey}
          onChange={handleInputChange}
        />
        <button
          onClick={handleSave}
          className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          Save
        </button>
      </div>
      {isSaved && <div className="mt-2 text-green-600">API Key securely saved</div>}
      <div className="mt-4">
        <button
          onClick={handleDeleteApiKey}
          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg"
        >
          Delete API Key
        </button>
      </div>
    </div>
  );
}

export default SettingsComponent;
