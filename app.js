const { app, BrowserWindow } = require('electron');
const CONFIG = require('./config');
const server = require('./scripts/start');

server().then(() => {
  let win = null;

  function createWindow() {
    win = new BrowserWindow({
      width: 1366,
      height: 768,
      // frame: false,
      // transparent: true,
      titleBarStyle: 'hiddenInset',
      icon: '/Users/hxtao/Desktop/local/github/better-than-better/pooy/client/assets/favicon.ico',
      webPreferences: {
        nodeIntegration: true
      }
    });

    win.isNative = true;

    win.loadURL(`http://localhost:${CONFIG.client_port}`);
    win.on('close', () => win = null);
  }

  app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

  app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
      createWindow()
    }
  });

  app.on('ready', createWindow);
}).catch((err) => {
  console.log(err);
});
