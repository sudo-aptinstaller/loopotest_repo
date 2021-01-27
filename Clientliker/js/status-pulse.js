const $ = require('jquery');
const appVersion = require('electron').remote.app.getVersion();
var checkBool = true;


console.log(appVersion);
setTimeout(()=>{
var applicationID = localStorage.getItem('applicationID');
    setInterval(()=>{
        $.ajax({
            type:'POST',
            url: "https://loopo.onblick.com/api/im-alive/"+applicationID,
            data: {
                applicationVersion : 'v'+appVersion
            },
            success:function(response){
                console.log(response);
                if(checkBool == true){
                    setTimeout(()=>{
                        localStorage.removeItem('applicationID');
                        checkBool = false;
                    },2000);
                }
            },
            error: function(data){
                console.log('Error : ',data);
            }
        });
    },60000);

},4000);