/* global chrome */
const keyForAPIKey = "openAIKey";

const isChromeExtension = () => {
  return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
};

export function getAPIKey() {
  return new Promise((resolve, reject) => {
    if (isChromeExtension()) {
      chrome.storage.local.get([keyForAPIKey], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[keyForAPIKey] || null);
        }
      });
    } else {
      resolve(localStorage.getItem(keyForAPIKey));
    }
  });
}

export function saveAPIKey(apiKey) {
  return new Promise((resolve, reject) => {
    if (isChromeExtension()) {
      chrome.storage.local.set({ [keyForAPIKey]: apiKey }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      localStorage.setItem(keyForAPIKey, apiKey);
      resolve();
    }
  });
}

export function deleteAPIKey() {
  return new Promise((resolve, reject) => {
    if (isChromeExtension()) {
      chrome.storage.local.remove(keyForAPIKey, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      localStorage.removeItem(keyForAPIKey);
      resolve();
    }
  });
}
