

//run search one page has loaded
window.addEventListener("load", (e) => {
    //check if api key and login is stored


    chrome.storage.local.get(["autofill_switch","locksmith_login", "locksmith_api_key"]).then(async (result) => {
        if(result.autofill_switch === false || result.autofill_switch === null ){
            return; //auto fill not enabled
        }

        var login_str = result.locksmith_login;
        var api_key = result.locksmith_api_key;

        if (login_str != null && api_key != null) {
            var login = JSON.parse(login_str);
            //ask background script for username and password for site
            chrome.runtime.sendMessage({ action: "get_site_login" });

        }
    });
});


//listen for response from background script with login
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if (!msg) {
        return;
    }
    var site_login = msg;

    if (site_login != false) {
        //search for username and password fields
        var user_inp = get_username_input();
        var pass_inp = get_password_input();
        //set input values
        if (user_inp) {

            user_inp.value = site_login.username;


        }
        if (pass_inp) {
            pass_inp.value = site_login.password;
        }
    }
});


//searches the page for a username input. returns false if one is not found
function get_username_input() {
    //check for email input
    var email_input = document.querySelectorAll('input[type=email]');
    if (email_input != null && email_input.length != 0) {
        return email_input[0];
    }
    email_input = document.querySelectorAll('input[name=login');
    if (email_input != null && email_input.length != 0) {
        return email_input[0];
    }
    return false;
}


//searches the page for a password input. returns false if one is not found
function get_password_input() {
    var password_input = document.querySelectorAll('input[type=password]');
    if (password_input != null && password_input.length != 0) {
        return password_input[0];
    }
    return false;

}

