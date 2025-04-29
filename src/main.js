const path = require('path');

// Tell dotenv to look in the working directory (your project root)
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
});

console.log('▶️ process.cwd() =', process.cwd());
console.log('▶️ __dirname      =', __dirname);
console.log('▶️ GOOGLE_CLIENT_ID =', process.env.GOOGLE_CLIENT_ID);

const { app, BrowserWindow, ipcMain } = require('electron');
const Keytar = require('keytar');
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;

// your OAuth settings
const SCOPES  = ['profile', 'email'];
const SERVICE = 'hapzea-google';
const ACCOUNT = 'default';

// sanity check
console.log('▶️ GOOGLE_CLIENT_ID =', process.env.GOOGLE_CLIENT_ID);

// 1) IPC handler for login requests from the renderer
// in your src/main.js, inside the handler:
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
      await Keytar.setPassword(SERVICE, ACCOUNT, tokens.refresh_token);
    }
    return tokens;
  } catch (err) {
    console.error('OAuth server error', err);
    throw err;
  }
});

// 2) Optionally: handle silent refresh at startup
ipcMain.handle('oauth:refresh', async () => {
  const refreshToken = await Keytar.getPassword(SERVICE, ACCOUNT);
  if (!refreshToken) return null;
  const oauth = new ElectronGoogleOAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    SCOPES
  );
  const { access_token } = await oauth.refreshToken(refreshToken);
  return { access_token };
});

async function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 640,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (!app.isPackaged) {
    await win.loadURL('http://localhost:5173')
      .catch(e => console.error('Failed to load URL:', e));
    win.webContents.openDevTools({ mode: 'right' });
  } else {
    await win.loadFile(path.join(__dirname, '../dist/index.html'))
      .catch(e => console.error('Failed to load file:', e));
  }

  win.webContents.on('crashed', () => console.error('WebContents crashed'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
