//Client Code
let threadInProgress = false;

var longRandomNumber;
var perIteration = 0;
var totalAck = 0;
var min = 250000;
var max = 550000;
var activeUserID;
var activeUserName;

$(()=>{
    whoAmI();
    localStorage.setItem('am-I-Idle?', 0);
});


function longRandom(){
    return Math.floor(Math.random() * 10 *  (max - min + 1) + min);
}

function whoAmI(){
    var profileLink = $("a.block.ember-view").attr('href');
    localStorage.setItem('profileLink', profileLink);

    if(localStorage.getItem('profileLink')){
        window.open('https://linkedin.com'+profileLink, 'NameCapture', 'height=10,width=10,top=10000,left=10000,resizable=false');
    }

    setTimeout(()=>{
        getPosts();
        localStorage.removeItem('linkToAppend');
        activeUserID = localStorage.getItem('userID');
        activeUserName = localStorage.getItem('userID-Username');
    },5000);
}

function getPosts(){
    $.ajax({
        type: "GET",
        url: "https://reply.onblick.com/api/posts",
        dataType: "JSON",
        success: function (response) {
            var likedPostsArray = JSON.parse(localStorage.getItem("likedPosts"));
            localStorage.removeItem("likedPosts");
            var totalLinksCounter = 0 ;
            var tempLinkHolder = [];
            if(!response.data || response.data == null || !response){
                localStorage.setItem('am-I-Idle?', 1);
            }else{
                // main logic
                for(mainIndex = 0; mainIndex < response.data.length; mainIndex++){
                    if(!response.data[mainIndex].linkCollection){   
                        continue;
                    }else{
                        for(let localIndex = 0 ; localIndex < response.data[mainIndex].linkCollection.length; localIndex++){
                            if(!likedPostsArray || likedPostsArray == null || likedPostsArray == ''){
                                tempLinkHolder.push('"'+response.data[mainIndex].linkCollection[localIndex]+'"');
                                totalLinksCounter++;
                                if(localIndex == 0){
                                    if(mainIndex == 0){
                                        setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
                                    }else{
                                        setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
                                    }
                                }else{
                                    if(mainIndex == 0){
                                        setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
                                    }else{
                                        setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);        
                                    }
                                }
                            }
                            else{
                                var checkCounter = 0;
                                for(let likedLinkCounter = 0; likedLinkCounter < likedPostsArray.length; likedLinkCounter++){

                                    if(response.data[mainIndex].linkCollection[localIndex] == likedPostsArray[likedLinkCounter]){
                                       break;
                                    }else if(response.data[mainIndex].linkCollection[localIndex] != likedPostsArray[likedLinkCounter]){
                                        checkCounter++;
                                    }
                                }
                                if(checkCounter == likedPostsArray.length){
                                    tempLinkHolder.push('"'+response.data[mainIndex].linkCollection[localIndex]+'"')
                                    totalLinksCounter++;
                                    if(localIndex == 0){
                                        if(mainIndex == 0){
                                            setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
                                        }else{
                                            setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
                                        }
                                    }else{
                                        if(mainIndex == 0){
                                            setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
                                        }else{
                                            setTimeout(openWindow, longRandom(), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);        
                                        }
                                    }
                                }
                            }  
                        }
                    }
                }
                sessionStorage.setItem('totalLinksCounter', totalLinksCounter);
            }
        }
    });
}

function openWindow(dataItem,indexing,companyName){
    if(sessionStorage.getItem('indexCheck'+companyName)< indexing && threadInProgress == false){
        threadInProgress = !threadInProgress;
        var localCount = sessionStorage.getItem('indexCheck'+companyName);
        var url = dataItem+'/';
        window.open(url,'likerWindow', 'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,visible=no,top=10000,left=10000,height=10,width=10', true);
        localCount++;
        sessionStorage.setItem('indexCheck'+companyName,localCount);
        whoLiked(dataItem, companyName, url);
        threadInProgress = !threadInProgress;
    }
}

function whoLiked(dataItem, companyName){
   var timeNow = new Date();
   var time = timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds()+ ":" +(new Date().toDateString()).replace(/\s/g,':');
    $.ajax({
       type: "POST",
       url: "https://reply.onblick.com/api/posts/"+companyName+"/likeAck/"+activeUserName+"/"+activeUserID,
       data: {
            userName : activeUserName,
            userId : activeUserID,
            likedPost : dataItem,
            timeStamp : time
       },
        dataType: "json",
        success: function (response) {
            //
        }
    });
    localStorage.setItem('linkToAppend', dataItem);
    localStorage.setItem('iHaveLinks', 1);
    totalAck = sessionStorage.getItem('totalAcknowledmentCounter');
    totalAck++;
    sessionStorage.setItem('totalAcknowledmentCounter', totalAck);
}


var amIIdleInterval = setInterval(()=>{
   if(sessionStorage.getItem('totalLinksCounter') == sessionStorage.getItem('totalAcknowledmentCounter')){
        clearInterval(amIIdleInterval);
        localStorage.setItem('am-I-Idle?', 1);
   }
   else if(sessionStorage.getItem('totalLinksCounter') == 0){
        clearInterval(amIIdleInterval);
        localStorage.setItem('am-I-Idle?', 1);
   }
},15000);

// Client Side Code End




// if(localIndex == 0){
//     if(mainIndex == 0){
//         setTimeout(openWindow, longRandom() * Math.floor(Math.random() * 10), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
//     }else{
//         setTimeout(openWindow, longRandom() * Math.floor(Math.random() * mainIndex * 2), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
//     }
// }else{
//     if(mainIndex == 0){
//         setTimeout(openWindow, longRandom() * Math.floor(Math.random() * localIndex * 20), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);    
//     }else{
//         setTimeout(openWindow, longRandom() * Math.floor(Math.random() * localIndex * mainIndex * 4), response.data[mainIndex].linkCollection[localIndex], response.data[mainIndex].linkCollection.length, response.data[mainIndex].companyName);        
//     }
// }



// OLD GET POST LOGIC 



// function getPosts(){
//     $.ajax({
//         type: "GET",
//         url: "https://reply.onblick.com/api/posts",
//         dataType: "JSON",
//         success: function (response) {
//             if(!response.data || response.data == null || !response){
//                 localStorage.setItem('am-I-Idle?', 1);
//             }else{

//                 for(let indexInArray = 0 ; indexInArray < response.data.length; indexInArray++){
//                     if(response.data[indexInArray].linkCollection == null){
//                         perIteration = perIteration + 0;
//                     }else{
//                         perIteration = perIteration + response.data[indexInArray].linkCollection.length;

//                     }
//                     sessionStorage.setItem('totalLinksCounter', perIteration);
//                     sessionStorage.setItem('indexCheck',0);
                    // if(response.data[indexInArray].linkCollection.length == 0){
                    //     if(perIteration == 0){
                    //         localStorage.setItem('am-I-Idle?', 1);
                    //     }else{
                    //         continue;
                    //     }
                    // }else{
//                         sessionStorage.setItem('linkSizeOf'+response.data[indexInArray].companyName, response.data[indexInArray].linkCollection.length);
//                         sessionStorage.setItem('dataCount', response.data.length);
//                         sessionStorage.setItem('companyCollection'+[indexInArray], response.data[indexInArray].companyName);
                        // for(let i = 0; i < response.data[indexInArray].linkCollection.length; i++){
                        //     if(i == 0){
                        //         setTimeout(()=>{
                        //             sessionStorage.setItem('linkCollectionOf'+response.data[indexInArray].companyName+i, response.data[indexInArray].linkCollection[i]);
                        //             openWindow(sessionStorage.getItem('linkCollectionOf'+response.data[indexInArray].companyName+i),response.data[indexInArray].linkCollection.length,sessionStorage.getItem('companyCollection'+[indexInArray]));
                        //         },longRandomNumber = longRandom() * 2 * 5);
                        //     }else{
                        //         setTimeout(()=>{
                        //             sessionStorage.setItem('linkCollectionOf'+response.data[indexInArray].companyName+i, response.data[indexInArray].linkCollection[i]);
                        //             openWindow(sessionStorage.getItem('linkCollectionOf'+response.data[indexInArray].companyName+i),response.data[indexInArray].linkCollection.length,sessionStorage.getItem('companyCollection'+[indexInArray]));
                        //         },longRandomNumber = longRandom() * 2 * i); // changes made
                        //     }
                        // }(this)
//                     }
//                 }

//             }//get success end here
//         }
//     });
// }