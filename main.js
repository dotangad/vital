// Modules to control application life and create native browser window
const { spawn } = require('child_process')
const { app, Menu, Tray } = require('electron')
const url = 'google.com'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let tray
let ping

function createTrayApp() {
  // Create the browser window.
  tray = new Tray('./images/timeout.png')

  function handleData(data) {
    // Strings only please
    data = data.toString()

    // Check if this is the first line
    if (data.match(/^PING/g)) return

    // Check if these are the ping stats
    if (
      data.match(/^---/g) ||
      data.match(/^\d+ packets transmitted/g) ||
      data.match(/^round-trip/g)
    )
      return

    if (data.match(/^Request timed out/g)) tray.setImage('./images/timeout.png')

    data = data.split('\n')[0]
    let ms = data
      .match(/time=(\d+\.\d+) ms/g)[0]
      .split('=')[1]
      .split(' ')[0]

    if (ms < 10) {
      tray.setImage('./images/10.png')
    } else if (ms < 20) {
      tray.setImage('./images/20.png')
    } else if (ms < 50) {
      tray.setImage('./images/50.png')
    } else if (ms < 70) {
      tray.setImage('./images/70.png')
    } else if (ms < 100) {
      tray.setImage('./images/100.png')
    } else if (ms < 150) {
      tray.setImage('./images/150.png')
    } else {
      tray.setImage('./images/other.png')
    }

    return
  }

  // Start ping process
  ping = spawn('ping', [url])
  ping.stdout.on('data', handleData)
  ping.stderr.on('data', e => console.error(e.toString()))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createTrayApp)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
