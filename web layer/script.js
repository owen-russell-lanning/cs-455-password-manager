

/**
 * initializes the login page
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

        is_valid_login(username, password, (api_key) => {
            DEFAULT_LOADING.replaceWith(this);
            if (!api_key) {
                document.getElementById("invalid-login-error").classList.remove("hidden");
            }
            else {
                receive_api_key(api_key);
            }
        });
    }


}

/**
 * receives the api key and stores the current login and key in local storage. then loads the dashboard
 * @param {*} api_key 
 */
function receive_api_key(api_key) {
    //store api key locally and login
    localStorage.setItem("api_key", api_key);
    localStorage.setItem("login", login); //TODO: ENCRYPT LOGIN

    //load dashboard as current page now that logged in
    load_dashboard();
}

/**
 * loads the dashboard as the main page
 */
async function load_dashboard() {

    //remove login page
    document.getElementById("login-page").remove();

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
            document.getElementById("dashboard-no-login-page").remove();
            document.getElementById("dashboard-valid-login-page").classList.remove("hidden");


            //populate inputs with login info
            document.getElementById("site-valid-login-username-input").value = is_login.username;

            document.getElementById("site-valid-login-password-input").value = is_login.password;

            //init unide password button
            var unhide_pass_btn = document.getElementById("site-valid-login-unhide");
            unhide_pass_btn.onmousedown = () => { unhide_valid_login_password() };
            unhide_pass_btn.onmouseup = () => { hide_valid_login_password() };

            //init copy buttons
            document.getElementById("copy-valid-username").onclick = () => {
                document.getElementById("site-valid-login-username-input").select();
                document.execCommand('copy');
                document.getElementById("site-valid-login-username-input").blur();
            }

            document.getElementById("copy-valid-password").onclick = () => {
                var pass_inp = document.getElementById("site-valid-login-password-input");
                pass_inp.type = "text";
                pass_inp.select();
                document.execCommand('copy');
                pass_inp.blur();
                pass_inp.type = "password";
            }


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
    callback(false);
}


/**
 * if the login is valid, executes callback with api key as result
 * @param {*} username 
 * @param {*} password 
 * @param {*} callback 
 */
function is_valid_login(username, password, callback) {
    callback("key");
}


/**
 * creates a user in the database
 * executes the callback with the received api key
 * @param {*} username 
 * @param {*} password 
 * @param {*} callback 
 */
function create_user(username, password, callback) {
    callback("key");
}

/**
 * gets the login for the given website and username. api key must be in local storage.
 * results is given to callback. false if no login for website
 * @param {*} username 
 * @param {*} website 
 * @param {*} callback 
 */
function get_login(username, website, callback) {
    var api_key = localStorage.getItem("api_key");
    callback({ username: "user", password: "pass" });
}

/**
 * sets a login for the given website. requires the username, site username and site password. api key must be in local storage
 * result is given to callback
 * @param {*} username 
 * @param {*} wesite 
 * @param {*} site_username 
 * @param {*} site_password 
 */
function set_login(username, wesite, site_username, site_password, callback) {
    var api_key = localStorage.getItem("api_key");
    callback(true);
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

