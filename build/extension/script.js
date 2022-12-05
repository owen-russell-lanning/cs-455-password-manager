const API_SERVER_IP = "http://localhost";
const API_SERVER_PORT = 5000;
const API_HOST = API_SERVER_IP + ":" + API_SERVER_PORT;

/**
 * initializes the login page and visual elements for the extension
 */
function init_login_page() {

    //have the login and create user buttons switch the login option page
    document.getElementById("create-user-page-button").onclick = function () {
        document.getElementById("login-page-button").classList.remove("selected");
        this.classList.add("selected");

        //switch page
        document.getElementById("login-create-user-page").style.visibility = "visible";
        document.getElementById("login-create-user-password-page").style.visibility = "hidden";
        document.getElementById("login-user-page").style.visibility = "hidden";
    }

    document.getElementById("login-page-button").onclick = function () {
        document.getElementById("create-user-page-button").classList.remove("selected");
        this.classList.add("selected");

        //switch page
        document.getElementById("login-create-user-page").style.visibility = "hidden";
        document.getElementById("login-create-user-password-page").style.visibility = "hidden";
        document.getElementById("login-user-page").style.visibility = "visible";
    }

    //init create user button
    document.getElementById("create-user-button").onclick = function () {


        document.getElementById("create-user-exists-error").classList.add("hidden");

        //get username entered
        var username = document.getElementById("create-user-username-input").value;

        if (username.trim() == "") {
            return; //no username entered
        }

        //switch to loading gif on click
        this.replaceWith(DEFAULT_LOADING);

        //check if user exists
        user_exists(username, (exists) => {

            //reset next button
            DEFAULT_LOADING.replaceWith(this);

            if (exists) {
                //display error message
                document.getElementById("create-user-exists-error").classList.remove("hidden");

            }
            else {
                //store username display create password section
                login = { username: username }

                document.getElementById("create-password-text").innerHTML = "Welcome " + username;
                document.getElementById("login-create-user-page").style.visibility = "hidden";
                document.getElementById("login-create-user-password-page").style.visibility = "visible";

            }
        });
    }

    //init finalize create user button. sends the creation of the user to the database
    document.getElementById("finalize-user-button").onclick = function () {
        //get username entered
        var password = document.getElementById("create-user-password-input").value;

        if (password.trim() == "") {
            return; //no password entered
        }

        login.password = password; //set password


        document.getElementById("login-create-user-password-page").style.visibility = "hidden";

        //send to database
        create_user(login.username, login.password, receive_api_key);

    }


    //init login button
    document.getElementById("login-button").onclick = function () {
        document.getElementById("invalid-login-error").classList.add("hidden");

        //get username and password
        var username = document.getElementById("login-username-input").value;
        var password = document.getElementById("login-password-input").value;

        if (username.trim() == "") { //no username entered
            return;
        }
        if (password.trim() == "") {//no password entered
            return;
        }


        //change to loading
        this.replaceWith(DEFAULT_LOADING);
        DEFAULT_LOADING.replaced = this; //store in object to avoid garbage collection
        check_login_and_proceed(username, password);

    }


    //if login is stored move past login page
    chrome.storage.local.get(["locksmith_login"]).then((result) => {
        var lock_login = result.locksmith_login;
        if (lock_login != null) {
            window.login = JSON.parse(lock_login);

            //continue login
            check_login_and_proceed(window.login.username, window.login.password);
        }
    });

}

function check_login_and_proceed(username, password) {
    is_valid_login(username, password, (api_key) => {
        DEFAULT_LOADING.replaceWith(DEFAULT_LOADING.replaced);
        if (!api_key) {
            document.getElementById("invalid-login-error").classList.remove("hidden");
        }
        else {
            login = { username: username, password: password }
            receive_api_key(api_key);
        }
    });
}

/**
 * receives the api key and stores the current login and key in local storage. then loads the dashboard
 * @param {*} api_key 
 */
function receive_api_key(api_key) {
    //store api key locally and login
    chrome.storage.local.set({ locksmith_api_key: api_key });
    var login_str = JSON.stringify(login);
    chrome.storage.local.set({ locksmith_login: login_str });//TODO: ENCRYPT LOGIN

    //load dashboard as current page now that logged in
    load_dashboard();
}

/**
 * loads the dashboard as the main page
 */
async function load_dashboard() {

    //remove login page
    var login_page = document.getElementById("login-page");
    if (login_page) {
        login_page.remove();
    }

    //show dashboard page
    document.getElementById("dashboard-page").style.visibility = "visible";

    //get the url of the current tab
    var url = await current_tab();
    url = new URL(url);
    document.getElementById("dashboard-site").innerHTML = url.hostname;

    //check if theres a login for the current page
    get_login(login.username, url.hostname, (is_login) => {
        var login_indictator = document.getElementById("dashboard-login-indicator");
        if (!is_login) {

            //display no login page
            document.getElementById("dashboard-no-login-page").classList.remove("hidden");
            login_indictator.innerHTML = "No Login";
            login_indictator.style.backgroundColor = "red";

            //init create login button
            document.getElementById("dashboard-create-login-btn").onclick = function () {
                //get values
                var site_username = document.getElementById("site-login-username-input").value;
                var site_password = document.getElementById("site-login-password-input").value;
                if (site_password.trim() == "" || site_username.trim() == "") {
                    return; //no value in one input
                }

                this.replaceWith(DEFAULT_LOADING);


                set_login(login.username, url.hostname, site_username, site_password, (result) => {
                    document.getElementById("site-login-username-input").value = "";
                    document.getElementById("site-login-password-input").value = "";
                    DEFAULT_LOADING.replaceWith(this);
                    //refresh dashboard
                    load_dashboard();

                });




            };
        }
        else {
            login_indictator.innerHTML = "Login Saved";
            login_indictator.style.backgroundColor = "green";

            //display valid login page
            var no_login_page = document.getElementById("dashboard-no-login-page")
            if (no_login_page) {
                no_login_page.remove();
            }
            document.getElementById("dashboard-valid-login-page").classList.remove("hidden");


            //populate inputs with login info
            document.getElementById("site-valid-login-username-input").value = is_login.username;

            document.getElementById("site-valid-login-password-input").value = is_login.password;

            //init unide password button
            var unhide_pass_btn = document.getElementById("site-valid-login-unhide");
            unhide_pass_btn.onmousedown = () => { unhide_valid_login_password() };
            unhide_pass_btn.onmouseup = () => { hide_valid_login_password() };

            //init copy buttons. copy input values on click
            document.getElementById("copy-valid-username").onclick = () => {
                document.getElementById("site-valid-login-username-input").select();
                document.execCommand('copy');
                document.getElementById("site-valid-login-username-input").blur();
            }

            document.getElementById("copy-valid-username").addEventListener("keyup", function (event) {
                if (event.code === "Enter") {
                    this.blur();
                }
            });

            document.getElementById("copy-valid-password").onclick = () => {
                var pass_inp = document.getElementById("site-valid-login-password-input");
                pass_inp.type = "text";
                pass_inp.select();
                document.execCommand('copy');
                pass_inp.blur();
                pass_inp.type = "password";
            }

            document.getElementById("site-valid-login-username-input").addEventListener("keyup", function (event) {
                console.log(event.code);
                if (event.code === "Enter") {
                    this.blur();
                }
            });


            document.getElementById("site-valid-login-password-input").addEventListener("keyup", function (event) {
                console.log(event.code);
                if (event.code === "Enter") {
                    this.blur();
                }
            });
            //init edit username and password buttons
            document.getElementById("edit-username-button").onclick = () => {
                var inp = document.getElementById("site-valid-login-username-input");
                inp.removeAttribute("readonly");
                inp.focus();
                inp.onblur = () => {
                    inp.setAttribute("readonly", "true");
                    set_login(login.username, url.hostname, inp.value, is_login.password, () => {
                        //reload dashboard
                        load_dashboard();
                    });
                }
            }

            document.getElementById("edit-password-button").onclick = () => {
                var inp = document.getElementById("site-valid-login-password-input");
                inp.removeAttribute("readonly");
                inp.focus();
                inp.onblur = () => {
                    inp.setAttribute("readonly", "true");
                    //remove login then add new login
                    remove_login(login.username, url.hostname, (result) => {
                        set_login(login.username, url.hostname, is_login.username, inp.value, () => {
                            //reload dashboard
                            load_dashboard();
                        });
                    });
                }


            }


        }
    });

    //set autofill switch value
    var autofill_switch = document.getElementById("autofill-switch");
    autofill_switch.setting = false;
    autofill_switch.addEventListener("change", (e) => {
        autofill_switch.setting = !autofill_switch.setting;
        chrome.storage.local.set({ autofill_switch: autofill_switch.setting });
    })

    //get the saved value
    chrome.storage.local.get(["autofill_switch"]).then((result) => {
        if (result.autofill_switch === true) {
            autofill_switch.click();
        }
    });






}



/**
 * @returns the default loading img
 */
function create_default_loading_img() {
    var loading = document.createElement("img");
    loading.src = "./icons/loading.svg";
    loading.style.height = "40px";
    return loading;
}


/**
 * check to see if the username exists in the database.
 * executes callback with true if username exists or false if not
 * @param {*} username 
 * @param {*} callback 
 */
function user_exists(username, callback) {
    fetch(API_HOST + "/userExists?" + new URLSearchParams({
        uid: username,
    })).then(result => result.json()).then((response) => {
        //feed response to callback
        if (response.hasOwnProperty("bool")) {
            callback(response.bool);
        }
    });
}


/**
 * if the login is valid, executes callback with api key as result
 * @param {*} username 
 * @param {*} password 
 * @param {*} callback 
 */
function is_valid_login(username, password, callback) {
    fetch(API_HOST + "/isValidLogin?" + new URLSearchParams({
        uid: username,
        password: password
    })).then(result => result.json()).then((response) => {
        //feed response to callback
        if (response.hasOwnProperty("key")) {

            callback(response.key);
        }
    });
}


/**
 * creates a user in the database
 * executes the callback with the received api key
 * @param {*} username 
 * @param {*} password 
 * @param {*} callback 
 */
function create_user(username, password, callback) {
    //call api server to create user
    fetch(API_HOST + "/newUser?" + new URLSearchParams({
        uid: username,
        password: password
    })).then(result => result.json()).then((response) => {
        //get key element
        if (response.hasOwnProperty("key") && response.key !== false) {
            callback(response.key);
        }
    });

}

/**
 * gets the login for the given website and username. api key must be in local storage.
 * results is given to callback. false if no login for website
 * @param {*} username 
 * @param {*} website 
 * @param {*} callback 
 */
function get_login(username, website, callback) {
    chrome.storage.local.get(["locksmith_api_key"]).then((result) => {
        var api_key = result.locksmith_api_key


        //call api server check if the user has a login for this website and if so, get the login
        fetch(API_HOST + "/getLogin?" + new URLSearchParams({
            uid: username,
            website: website,
            apiKey: api_key
        })).then(result => result.json()).then((response) => {
            //get login if theres a login for the site
            if (response !== "false" && response.hasOwnProperty("user") && response.hasOwnProperty("pass")) {
                callback({ username: response.user, password: response.pass });
            }
            else {
                callback(false);
            }
        });
    });


}

/**
 * sets a login for the given website. requires the username, site username and site password. api key must be in local storage
 * result is given to callback
 * @param {*} username 
 * @param {*} wesite 
 * @param {*} site_username 
 * @param {*} site_password 
 */
function set_login(username, website, site_username, site_password, callback) {
    chrome.storage.local.get(["locksmith_api_key"]).then((result) => {
        var api_key = result.locksmith_api_key;
        fetch(API_HOST + "/removeLogin?" + new URLSearchParams({
            uid: username,
            website: website,
            apiKey: api_key

        })).then(() => {


            fetch(API_HOST + "/setLogin?" + new URLSearchParams({
                uid: username,
                password: site_password,
                user: site_username,
                website: website,
                apiKey: api_key

            })).then(result => result.json()).then((response) => {
                //get key element
                callback(true);
            });
        });
    });

}

/**
 * removes the login for the website from the database
 * @param {*} username 
 * @param {*} website 
 * @param {*} callback 
 */
function remove_login(username, website, callback) {
    chrome.storage.local.get(["locksmith_api_key"]).then((result) => {
        var api_key = result.locksmith_api_key;
        fetch(API_HOST + "/removeLogin?" + new URLSearchParams({
            uid: username,
            website: website,
            apiKey: api_key

        })).then(result => result.json()).then((response) => {
            //get key element
            callback(true);
        });
    });
}

/**
 * 
 * @returns the url of the current tab
 */
async function current_tab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
}

/**
 * unhides the valid login password on screen
 */
function unhide_valid_login_password() {
    document.getElementById("site-valid-login-password-input").type = "text";
}

/**
 * hides the valid login password on screen
 */
function hide_valid_login_password() {
    document.getElementById("site-valid-login-password-input").type = "password";
}

//init constansts
const DEFAULT_LOADING = create_default_loading_img();
let login = {};

init_login_page();

