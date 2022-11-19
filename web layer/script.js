

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
                window.login = { username: username }

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

        window.login.password = password; //set password


        document.getElementById("login-create-user-password-page").style.visibility = "hidden";

        //send to database
        create_user(window.login.username, window.login.password, receive_api_key);

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
    localStorage.setItem("login", window.login); //TODO: ENCRYPT LOGIN

    //load dashboard as current page now that logged in
    load_dashboard();
}

/**
 * loads the dashboard as the main page
 */
function load_dashboard() {

    //hide all pages
    document.getElementById("login-page").style.visibility = "hidden";
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

//init constansts
const DEFAULT_LOADING = create_default_loading_img();

init_login_page();

