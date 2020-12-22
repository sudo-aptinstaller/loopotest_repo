const $ = require('jquery');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const app = require('electron').remote.app;
const { remote } = require('electron');
const path = require('path');


var click = true;

// Dynamic Local LinkedIn Page UI

$("#password-visibility-toggle").on('click', function(){
    if(click == true){
        $("#password").attr('type', 'text');
        $("#password-visibility-toggle").text('Hide');
        click = !click;
    }else{
        $("#password").attr('type', 'password');
        $("#password-visibility-toggle").text('Show');
        click = !click;
    }
});

// End Dynamic Local LinkedIn Page UI

function encodeItem(text) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

function decodeItem(cypher){
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(cypher));
  }


function login(){

    var username =  $("#username").val();
    var password = $("#password").val();

    console.log(username);
    console.log(password);

    encryptedUsername = encodeItem(username);
    encryptedPassword = encodeItem(password);

    fs.readdir(app.getPath('userData') + '/applicationData/', (error) => {
        if (error) {
            console.log('error here');
            //console.log(error);
            //fs.mkdirSync(__dirname + '/data/', (error) => {
                // if (error) {
                //     console.log(error);
        }else{
                    fs.writeFileSync(app.getPath('userData')+'/applicationData/me.joel', encryptedUsername+'   '+encryptedPassword);
                    remote.app.relaunch();
                    window.close();
        //  }
            //});
        }
    });
}
