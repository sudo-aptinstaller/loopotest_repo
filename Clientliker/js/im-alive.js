const $ = require('jquery');

var applicationID = localStorage.getItem('applicationID');
setTimeout(()=>{
    localStorage.removeItem('applicationID');
    $.ajax({
        type:'POST',
        url: "https://loopo.onblick.com/api/im-alive/"+applicationID,
        success:function(response){
            console.log(response);
        },
        error: function(data){
            console.log('Error : ',data);
        }
    });
},3000);
