const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Google OAuth methods
  login: () => ipcRenderer.invoke('oauth:login'),
  refreshToken: () => ipcRenderer.invoke('oauth:refresh'),
  
  // You can add more methods here as needed
});

console.log('Preload script loaded');