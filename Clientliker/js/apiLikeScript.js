

//code shouldn't be interrupted

$(document).ready(function(){
    // for(i = 0 ; i < sessionStorage.getItem('linkSizeOf'+sessionStorage.getItem('companyCollection')[sessionStorage.getItem('dataCount')]); i++){
    //     if(window.location.href == sessionStorage.getItem('linkCollectionOf'+sessionStorage.getItem('companyCollection')[sessionStorage.getItem('dataCount')]+i)){
            if($(".react-button__trigger").attr("aria-pressed") == 'false'){
                $('.react-button__trigger').click();
            }
    //     }
    // }
});
