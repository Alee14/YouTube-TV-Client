const { app, BrowserWindow, session } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const package = require("./package.json");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const userAgent = "Mozilla/5.0 (Linux; Tizen 2.3) "+ package.name + "/" + package.version + " AppleWebKit/538.1 (KHTML, like Gecko)Version/2.3 TV Safari/538.1";
const URL = "https://youtube.com/tv";

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        icon: __dirname + "/build/icon.png"
    });

    win.loadURL(URL);
    console.log("Loading " + URL);

}

function fetchCookie(){
    console.log("Fetching cookies...")
    session.defaultSession.cookies.get({
        url: URL
    });
}

app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify();
});

app.whenReady().then(() => {
    console.log("Started YouTube TV Client " + package.version);
    createWindow();
    fetchCookie();

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = userAgent;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      });  
    console.log("User Agent has been set to \"" + userAgent + "\"");

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

  });

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
  });

  autoUpdater.on('update-available', () => {
    console.log('Update available.');
  });


  autoUpdater.on('update-not-available', () => {
    console.log('No updates are currently available...');
  });

  autoUpdater.on('error', (err) => {
    console.log('Error in auto-updater. ' + err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log(log_message);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded');
  });

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});