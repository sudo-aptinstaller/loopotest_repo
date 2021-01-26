const $ = require('jquery');

var checkBool = true;

setTimeout(()=>{
var applicationID = localStorage.getItem('applicationID');
    setInterval(()=>{
        $.ajax({
            type:'POST',
            url: "https://loopo.onblick.com/api/im-alive/"+applicationID,
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