const {app, BrowserWindow, Menu, Tray} = require('electron');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');


var updateCheck = true;
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath('exe')
});


const iconLocation = path.join(__dirname, '/icons/icon.ico');
var usernameError;
var passwordError;
var userID;
var tinyWindow;
var longRandomNumber;
var tray;

function appReadyCall(){
  BrowserWindow.addExtension(__dirname+'/Clientliker').then((name) => console.log(`Added Extension:  ${name}`)).catch((err) => console.log('An error occurred: ', err));
  setTimeout(() =>{
    linkedIn();
  },longRandomNumber = longRandom()); // changes made
}


function generateUserId(){
  fs.readdir(app.getPath('userData') + '/applicationData/', (error) => {
    if (error) {
      console.log(error);
      fs.mkdir(app.getPath('userData') + '/applicationData/', (error) => {
          if (!error) {
            fs.writeFileSync(app.getPath('userData')+'/applicationData/user.joel', randomString(32));
          }
      });
    }
  });
}

//localStorage of linkCollection


function appendToLinkCollection(linksToAppend, currentWindow){
    //add single link to array code here 
    fs.readFile(app.getPath('userData')+'/applicationData/linkCol.json', (error,data) =>{
      if(!error){
        if(data == null || data == '' || !data){
          fs.writeFileSync(app.getPath('userData')+'/applicationData/linkCol.json', '["'+linksToAppend+'"]');
          currentWindow.webContents.executeJavaScript('localStorage.removeItem("linkToAppend")');
        }else if(data != null || data != '' || data ){
          var tempArray = [];
          var tempData = [];
          tempData = JSON.parse(data);
          console.log(tempData);
          tempData.forEach(element => {
              tempArray.push('"'+element+'"');
          });
          tempArray.push('"'+linksToAppend+'"');
          console.log(tempArray);
          fs.writeFileSync(app.getPath('userData')+'/applicationData/linkCol.json', '['+tempArray+']');
          currentWindow.webContents.executeJavaScript('localStorage.removeItem("linkToAppend")');
        }
      }
    });
}




function randomString(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function longRandom(){
  var max = 80000;
  var min = 10000;
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function cycleRandom(){
  return Math.floor(Math.random() * (270000 - 180000 + 1) + 180000);
}
function encodeItem(text) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};
function decodeItem(cypher){
  return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(cypher));
}
  function userCreds(){
    const credsWindow = new BrowserWindow({
      webPreferences:{
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration : true,
        enableRemoteModule: true,
        allowRunningInsecureContent: true
      }
    });
    credsWindow.webContents.executeJavaScript('localStorage.setItem("am-I-Idle?", "0")');
    credsWindow.setMenuBarVisibility(false);
    credsWindow.loadFile('index.html');
  }
  function linkedIn(){
    var cypherUser;
    var cypherPass;
    var decryptedUser;
    var decryptedPass;
    fs.readFile(app.getPath('userData') + '/applicationData/me.joel','utf-8', (error, data) =>{
      if(error){
        console.log(error);
      }else{
        var cyperData = data.split('   ', 2);
        cypherUser = cyperData[0];
        cypherPass = cyperData[1];
        decryptedUser = decodeItem(cypherUser);
        decryptedPass = decodeItem(cypherPass);


        var newWindow = new BrowserWindow({icon: iconLocation,skipTaskbar: true,show:false,
          webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration : true,
            enableRemoteModule: true,
            allowRunningInsecureContent: true
            
          } 
        });
        newWindow.webContents.executeJavaScript('localStorage.setItem("am-I-Idle?", "0")');
      fs.readFile(app.getPath('userData') + '/applicationData/linkCol.json','utf-8', (error, data) =>{
        if(error || data == '' || !data){
          fs.writeFileSync(app.getPath('userData')+'/applicationData/linkCol.json', '');
        }else{
          newWindow.webContents.executeJavaScript('localStorage.setItem("likedPosts",JSON.stringify('+data+'))',true);
        }
      });

        newWindow.webContents.executeJavaScript('localStorage.setItem("linkedinUsername", "'+decryptedUser+'")', true);
        newWindow.webContents.executeJavaScript('localStorage.setItem("linkedinPassword", "'+decryptedPass+'")', true);
        newWindow.webContents.executeJavaScript('localStorage.setItem("userID", "'+userID+'")', true);

        setTimeout(()=>{
          newWindow.loadURL("https://www.linkedin.com/login");
        },10000);

        var checkCreds = setInterval(()=>{
          newWindow.webContents.executeJavaScript('localStorage.getItem("username-error")', true).then(data =>{
            usernameError = data;
          });
          newWindow.webContents.executeJavaScript('localStorage.getItem("password-error")', true).then(data =>{
            passwordError = data;
          });
        },2000);


        var checkError = setInterval(()=>{

          if(usernameError != null || passwordError != null || newWindow.webContents.getURL().search(/https\:\/\/www\.linkedin\.com\/checkpoint\/challenge\/.*/g) == 0){
            newWindow.webContents.executeJavaScript('localStorage.removeItem("username-error")', true);
            newWindow.webContents.executeJavaScript('localStorage.removeItem("password-error")', true);

            var checkPassInterval = setInterval(() => {
                if(usernameError == '404'){
                  clearInterval(checkError);
                  clearInterval(checkCreds);
                  tinyWindow.loadFile('error.html');
                  tinyWindow.webContents.executeJavaScript('localStorage.setItem("error", "Email Error")');
                  setTimeout(()=>{
                    tinyWindow.hide();
                  },10000);
                  fs.unlink(app.getPath('userData') + '/applicationData/me.joel', function(error){
                      newWindow.webContents.executeJavaScript('localStorage.removeItem("username-error")', true);
                      clearInterval(checkPassInterval);
                      newWindow.close();
                      userCreds();
                  });
                }else if(passwordError == '404'){
                  clearInterval(checkError);
                  clearInterval(checkCreds);
                  tinyWindow.loadFile('error.html');
                  tinyWindow.webContents.executeJavaScript('localStorage.setItem("error", "Password Error")');
                  setTimeout(()=>{
                    tinyWindow.hide();
                  },10000);
                  fs.unlink(app.getPath('userData') + '/applicationData/me.joel', function(error){
                      newWindow.webContents.executeJavaScript('localStorage.removeItem("password-error")', true);
                      clearInterval(checkPassInterval);
                      newWindow.close();
                      userCreds();
                  });
                }else if(newWindow.webContents.getURL().search(/https\:\/\/www\.linkedin\.com\/checkpoint\/challenge\/.*/g) == 0){
                  clearInterval(checkPassInterval);
                    tinyWindow.loadFile('robo.html');
                    setTimeout(()=>{
                      tinyWindow.hide();
                      newWindow.show();
                    },6000);
                }
            },5000);           

          

          }else if(newWindow.webContents.getURL().search(/https\:\/\/www\.linkedin\.com\/check\/add-phone.*/g) == 0){
                  clearInterval(checkPassInterval);
                  clearInterval(checkCreds);
                  newWindow.loadURL('https://www.linkedin.com/feed/');
          }else{

            //Success Condition   

            if(newWindow.webContents.getURL() == 'https://www.linkedin.com/feed/'){
              tinyWindow.loadFile("success.html");
              clearInterval(checkError);
              clearInterval(checkPassInterval);
              clearInterval(checkCreds);
              //Timeout Release Since  Successfully Authenticated
                newWindow.webContents.executeJavaScript('localStorage.removeItem("linkedinUsername")', true);
                newWindow.webContents.executeJavaScript('localStorage.removeItem("linkedinPassword")', true);
                setTimeout(()=>{
                  tinyWindow.hide();
                   //On Success Tray
                  if(tray == undefined || !tray || tray == ''){
                    tray = new Tray(iconLocation)
                    var contextMenu = Menu.buildFromTemplate([
                      { label: 'Check Status', click:  function(){
                        tinyWindow.loadFile('success.html');
                        setTimeout(()=>{
                          tinyWindow.show();
                        },800);
                        setTimeout(()=>{
                          tinyWindow.hide();
                        },5000);
                      } },
                      { label: 'Quit', click:  function(){
                          app.isQuiting = true;
                          app.quit();
                      } }
                    ]);
                    tray.setContextMenu(contextMenu);
                  }else{
                    console.log('tray already exist');
                  }
                },5000);
              }
          }
        },5000);

        var linkCollectionInterval =  setInterval(()=>{
          newWindow.webContents.executeJavaScript('localStorage.getItem("iHaveLinks")').then( data =>{
              if(data == 1){
                  newWindow.webContents.executeJavaScript('localStorage.setItem("iHaveLinks", 0)');
                  newWindow.webContents.executeJavaScript('localStorage.getItem("linkToAppend")').then(linkCollectionToAppend =>{
                  appendToLinkCollection(linkCollectionToAppend, newWindow);
                });
              }
            });
        },10000);
          
        var idleTimeInterval = setInterval(()=>{
          newWindow.webContents.executeJavaScript('localStorage.getItem("am-I-Idle?")').then(data =>{
            if(data == 1){
              clearInterval(linkCollectionInterval);
              clearInterval(idleTimeInterval);
              newWindow.loadURL("https://www.linkedin.com/m/logout");
              newWindow.close();
              setTimeout(()=>{
                appReadyCall();
              },cycleRandomVariable = cycleRandom());
            }
          })
        },24000);
      }
    });
  }

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

// updater codes

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

function createDefaultWindow() {
  win = new BrowserWindow({frame:false,height:400,width:300,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration : true,
      enableRemoteModule: true,
      allowRunningInsecureContent: true
    }
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}
 
app.whenReady().then(() => {

  if(updateCheck == true){
    updateCheck != updateCheck;
    createDefaultWindow();
    autoUpdater.checkForUpdates();

    autoUpdater.on('checking-for-update', () => {
      sendStatusToWindow('Checking for update...');
    })
    autoUpdater.on('update-available', (ev, info) => {
      sendStatusToWindow('Update available');
    })
    autoUpdater.on('update-not-available', (ev, info) => {
      setTimeout(()=>{
        win.close();
      },2500);
      fs.readFile(app.getPath('userData') + '/applicationData/user.joel','utf-8', (error, data) =>{
        if(error || data == '' || !data){
          generateUserId();
        }else{
          userID = data;
        }
      });
      fs.readFile(app.getPath('userData') + '/applicationData/me.joel','utf-8', (error, data) =>{
        if(error || data == '   ' || !data){
          userCreds();
        }else{
          tinyWindow = new BrowserWindow({resizable:false,frame:true,icon: iconLocation,skipTaskbar: true,alwaysOnTop:true,
            webPreferences:{
              preload: path.join(__dirname, 'preload.js'),
              nodeIntegration : true,
              enableRemoteModule: true,
              allowRunningInsecureContent: true
            }
          });
          tinyWindow.loadFile('sync.html');
          tinyWindow.setMenuBarVisibility(false);
          // Minimized Functionality 
          tinyWindow.on('minimize',function(event){
            event.preventDefault();
            tinyWindow.hide();
          });
          tinyWindow.on('close', function (event) {
            if(!app.isQuiting){
              event.preventDefault();
              tinyWindow.hide();
            }
            return false;
          });
          appReadyCall();
        }
      });
    });
    autoUpdater.on('error', (ev, err) => {
      sendStatusToWindow('Error in auto-updater'); // removed error log
    });
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      sendStatusToWindow(log_message);
    });
    autoUpdater.on('update-downloaded', (ev, info) => {
      sendStatusToWindow('Update Completed : Installing');
      setTimeout(()=>{
        sendStatusToWindow('This window will close now, launch from desktop.');
        setTimeout(()=>{
          win.close();
        },4000);
      },4000);
    });

  }
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) credsWindow()
    });
});




//Error - onblick inbetween causing issue -> causing HRtalk to repeat
    // Goes to am_I_idle

    // }else{
    // else if(data != null || data != '' || data){
    //   var tempArray = [];
    //   var tempData = [];
    //   var tempLink = [];
    //   tempData = JSON.parse(data);
    //   tempData.forEach(element => {
    //       tempArray.push(element);
    //   });
    //   tempLink = JSON.parse(linksToAppend);
    //   tempLink.forEach(element2 => {
    //     tempArray.push(element2);
    //   });
    //   fs.writeFileSync(__dirname+'/data/linkCol.json', JSON.stringify(tempArray));
    //   currentWindowData.loadURL("https://www.linkedin.com/m/logout");
    //   currentWindowData.close();
    //     setTimeout(()=>{
    //       appReadyCall();
    //     },cycleRandomVariable = cycleRandom());
      
    // }