import { app, BrowserView, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let win: BrowserWindow | null = null;
let browserView: BrowserView | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: true,
    
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.setContentProtection(true);

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  win.webContents.on('did-finish-load', () => {
    browserView = new BrowserView();
    win!.addBrowserView(browserView);

    resizeBrowserWindow();


    browserView.webContents.on('did-start-navigation', (d) => {
      let url = browserView?.webContents.getURL();
      if (url == undefined || url == "") return;
      console.log("url changed: " + url);
      win?.webContents.send('update-url', url);
    })
    browserView.webContents.loadURL('https://www.google.com');

  });

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win!.setTitle(title)
  })

  win.on('resize', () => {
    resizeBrowserWindow();
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

function resizeBrowserWindow() {
  const bound = win!.getBounds();
  const height = 30;
  browserView!.setBounds({
    x: 0,
    y: height,
    width: bound.width,
    height: bound.height - height,
  });
}

ipcMain.handle('back', e => {
  console.log('back');
  browserView?.webContents.goBack();
});


ipcMain.handle('forward', e => {
  console.log('forward');
  browserView?.webContents.goForward();
});

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
