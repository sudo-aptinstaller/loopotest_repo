$(()=>{
    localStorage.removeItem("robofound");
    if((window.location.href).search(/https\:\/\/www\.linkedin\.com\/checkpoint\/lg\/login-challenge-submit\?.*/g) == 0){
        window.resizeTo(1,1);
        window.moveBy(10000, 10000);
    }
});
var min = 8000;
var max = 15000;

function longRandom(){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

setTimeout(()=>{
    if(localStorage.getItem('linkedinUsername') || localStorage.getItem('linkedinPassword')){
        $("#username").val(localStorage.getItem('linkedinUsername'));
        $("#password").val(localStorage.getItem('linkedinPassword'));
        localStorage.removeItem('linkedinUsername');
        localStorage.removeItem('linkedinPassword');
        $(".btn__primary--large").trigger('click');
    }
},clickDelay = longRandom());

setInterval(()=>{
    if($("#error-for-username").hasClass('hidden') == false ){
        setTimeout(()=>{
            localStorage.setItem('username-error', 404);
        },2000);
    }

    else if($("#error-for-password").hasClass('hidden') == false ){
        setTimeout(()=>{
            localStorage.setItem('password-error', 404);
        },2000);
    }
},3000);





