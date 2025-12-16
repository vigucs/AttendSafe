import { app, BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db';
import { registerHandlers } from './ipcHandlers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//    app.quit();
// }

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.mjs'),
        },
        autoHideMenuBar: true,
    });

    // and load the index.html of the app.
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    // Initialize Database
    initDB();

    // Register IPC Handlers
    registerHandlers();

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
