const $ = require('jquery');

var applicationID = localStorage.getItem('applicationID');
setTimeout(()=>{
    $.ajax({
        type:'POST',
        url: "https://loopo.onblick.com/api/im-alive/"+applicationID,
        success:function(response){
            console.log(response);
            localStorage.removeItem('applicationID');
        },
        error: function(data){
            console.log('Error : ',data);
        }
    });
},4000);
