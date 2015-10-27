var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var request = require('superagent');
var _ = require('underscore');
var Datastore = require('nedb');
var auth = new Datastore({ filename: 'data/auths.db', autoload: true });

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    'width': 1000,
    'height': 600,
    'frame': true,
  });

  // Handle the response from FB
  mainWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
    var matches = newUrl.match(/#access_token=([a-zA-Z0-9]{200,})/);
    if ( matches ) {
      var access_token = matches[1];
      console.log('The ACCESS TOKEN is: ' + access_token);
      auth.insert({access_token: access_token});
      mainWindow.loadUrl('file://' + __dirname + '/index.html');
    }
  });

  ipc.on('newUserToken', function(event, access_token) {
    console.log('newUserToken received..');
    var url = "https://graph.facebook.com/v2.5/me?access_token=" + access_token;
    request
      .get(url)
      .end(function(err, res){
        if ( res && res.ok ) {
          auth.find({}, function(err, docs){
            var data = docs[0];
            var json_response = JSON.parse(res.text);
            var userData = _.extend(data, json_response);
            console.log('persisting newUser..');
            auth.update({access_token: userData.access_token}, userData, {upsert: true});
          });
        } else {
          auth.remove({});
          console.error(err.status);
        }
      });
  });

  ipc.on('need-auth', function(event, args) {
    var fbAuthUrl = 'https://www.facebook.com/dialog/oauth?'
                    + 'client_id=464891386855067'
                    + '&redirect_uri=https://www.facebook.com/connect/login_success.html'
                    + '&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details'
                    + '&response_type=token';

    console.log('Open facebook...');
    return mainWindow.loadUrl(fbAuthUrl);
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
