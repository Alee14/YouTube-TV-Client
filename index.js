const { app, BrowserWindow, session } = require('electron');
const package = require("./package.json");

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


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});