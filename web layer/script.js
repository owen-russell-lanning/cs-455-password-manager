/**
 * initializes the login page
 */
function init_login_page() {

    //have the login and create user buttons switch the login option page
    document.getElementById("create-user-page-button").onclick = function(){
        document.getElementById("login-page-button").classList.remove("selected");
        this.classList.add("selected");
    }

    document.getElementById("login-page-button").onclick = function(){
        document.getElementById("create-user-page-button").classList.remove("selected");
        this.classList.add("selected");
    }
}



init_login_page();