const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Google OAuth methods
  login: () => {
    console.log('Attempting to authenticate with Google...');
    return ipcRenderer.invoke('oauth:login');
  },
  refreshToken: () => {
    console.log('Attempting to refresh token...');
    return ipcRenderer.invoke('oauth:refresh');
  },
  
  // You can add more methods here as needed
  logout: () => console.log('Logout requested'),
});

console.log('Preload script loaded successfully');