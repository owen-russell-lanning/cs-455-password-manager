

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

        //send to database
        create_user(window.login.username, window.login.password, (api_key) => {
            //store api key locally
            localStorage.setItem("api_key", api_key);
        });

    }
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

