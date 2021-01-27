const $ = require('jquery');
const appVersion = require('electron').remote.app.getVersion();

setTimeout(()=>{
var applicationID = localStorage.getItem('applicationID');
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
},4000);
