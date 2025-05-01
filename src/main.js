const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;

// Try to use keytar, fall back to our secure storage implementation if it fails
let storageModule;
try {
  storageModule = require('keytar');
  console.log('Using keytar for secure storage');
} catch (error) {
  console.warn('Keytar not available, using fallback secure storage:', error.message);
  storageModule = require('./secureStorage');
}

// Tell dotenv to look in the working directory (your project root)
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
});

// Debug information
console.log('▶️ process.cwd() =', process.cwd());
console.log('▶️ __dirname    =', __dirname);
console.log('▶️ GOOGLE_CLIENT_ID =', process.env.GOOGLE_CLIENT_ID);

// your OAuth settings
const SCOPES = ['profile', 'email'];
const SERVICE = 'hapzea-google';
const ACCOUNT = 'default';

// 1) IPC handler for login requests from the renderer
ipcMain.handle('oauth:login', async () => {
  const oauth = new ElectronGoogleOAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    SCOPES
  );

  try {
    // port:0 → ephemeral free port
    const tokens = await oauth.openAuthWindowAndGetTokens({ port: 0 });
    if (tokens.refresh_token) {
      await storageModule.setPassword(SERVICE, ACCOUNT, tokens.refresh_token);
    }
    return tokens;
  } catch (err) {
    console.error('OAuth server error', err);
    throw err;
  }
});

// 2) Optionally: handle silent refresh at startup
ipcMain.handle('oauth:refresh', async () => {
  const refreshToken = await storageModule.getPassword(SERVICE, ACCOUNT);
  if (!refreshToken) return null;
  const oauth = new ElectronGoogleOAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    SCOPES
  );
  const { access_token } = await oauth.refreshToken(refreshToken);
  return { access_token };
});

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

async function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 640,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app depending on the environment
  try {
    if (!app.isPackaged) {
      // Development mode - connect to Vite dev server
      console.log('Loading development URL: http://localhost:5173');
      await mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools({ mode: 'right' });
    } else {
      // Production mode - load from built files
      console.log('Loading production HTML file');
      const prodPath = path.join(__dirname, '../renderer/index.html');
      console.log('Production path:', prodPath);
      await mainWindow.loadFile(prodPath);
    }
  } catch (error) {
    console.error('Failed to load application:', error);
    
    // Show error in window if loading fails
    mainWindow.webContents.loadURL(`data:text/html;charset=utf-8,
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Failed to load application</h1>
          <p>${error.message}</p>
          <p>If in development mode, make sure the Vite dev server is running.</p>
          <p>Try running: <code>npm run dev</code></p>
        </body>
      </html>
    `);
  }

  // Handle window crashes
  mainWindow.webContents.on('crashed', () => {
    console.error('WebContents crashed');
  });

  // Handle closed window
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// When Electron is ready, create window
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// On macOS, re-create window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});