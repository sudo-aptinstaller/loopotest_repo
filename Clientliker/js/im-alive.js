const $ = require('jquery');

setTimeout(()=>{
var applicationID = localStorage.getItem('applicationID');
    $.ajax({
        type:'POST',
        url: "https://loopo.onblick.com/api/im-alive/"+applicationID,
        success:function(response){
            console.log(response);
            setTimeout(()=>{
                localStorage.removeItem('applicationID');
            },2000);
        },
        error: function(data){
            console.log('Error : ',data);
        }
    });
},4000);
