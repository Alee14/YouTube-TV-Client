const { app, BrowserWindow, session } = require('electron')
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: true,
        autoHideMenuBar: true
    })

    win.loadURL('https://youtube.com/tv');
}

function cookieDump(cookies) {
    var buffer = '['
    for (let cookie of cookies) {
        console.log(cookie)
        buffer += JSON.stringify(cookie)
        buffer += ","
    }
    buffer = buffer.slice(0, -1) + "]"
    fs.writeFile('cookies.json', buffer, function (err) {
        if (err) return console.log(err);
        console.log('Wrote cookies to file');
    });
}

app.whenReady().then(() => {
    console.log("Started YouTube TV Client 2.0");
    createWindow();

    session.defaultSession.cookies.get({
        url: 'https://youtube.com/tv'
    });

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Linux; Tizen 2.3) AppleWebKit/538.1 (KHTML, like Gecko)Version/2.3 TV Safari/538.1';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      });  

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

  });


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
    session.defaultSession.cookies.get({
        url: 'https://youtube.com/tv'
    })
        .then((cookies) => {
            cookieDump(cookies);
            console.log("Wrote Cookies");
        }).catch((error) => {
            console.log(error);
    });
    
});