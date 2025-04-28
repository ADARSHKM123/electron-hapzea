// src/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Keytar = require('keytar');
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
const SCOPES = ['profile','email'];
const SERVICE = 'hapzea-google', ACCOUNT = 'default';

require('dotenv').config();

console.log('GOOGLE_CLIENT_ID=', process.env.GOOGLE_CLIENT_ID);

async function createWindow() {
  const win = new BrowserWindow({
    width: 900, height: 640,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // DEV → load Vite, open DevTools
  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173')
       .catch(e => console.error('Failed to load URL:', e));
    win.webContents.openDevTools({ mode: 'right' });
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
       .catch(e => console.error('Failed to load file:', e));
  }

  // catch any errors
  win.webContents.on('crashed', () => console.error('WebContents crashed'));
}


app.whenReady().then(createWindow);
