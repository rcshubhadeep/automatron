import React, { useState } from 'react';

function SettingsComponent() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false); // State to track save status

  const handleSave = () => {
    // Logic to save the API key
    console.log('API Key Saved:', apiKey);
    localStorage.setItem('openAIKey', apiKey);
    // Security etc.
    setApiKey('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          Save
        </button>
      </div>
      {isSaved && <div className="mt-2 text-green-600">API Key securely saved</div>}
    </div>
  );
}

export default SettingsComponent;