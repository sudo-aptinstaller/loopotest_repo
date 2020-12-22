$(() => {
    if(window.location.href == 'https://www.linkedin.com'+localStorage.getItem('profileLink')){
        var currentUserName = $(".inline.t-24.t-black.t-normal.break-words").text();
        currentUserName = currentUserName.replace(/\s/g, '');
        localStorage.setItem('userID-Username', currentUserName);
        localStorage.removeItem('profileLink');
        window.close();
    }
});
