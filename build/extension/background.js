const API_SERVER_IP = "http://localhost";
const API_SERVER_PORT = 5000;
const API_HOST = API_SERVER_IP + ":" + API_SERVER_PORT;

//create listener to wait for content script
chrome.runtime.onMessage.addListener(
    function (request, sender, send_response) {



        if (request.action == "get_site_login") {
            var hostname = (new URL(sender.tab.url)).hostname;

            chrome.storage.local.get(["locksmith_login"]).then((result) => {
                var login = JSON.parse(result.locksmith_login);
                //check for login
                get_login(login.username, hostname, async (result) => {
                    chrome.tabs.sendMessage(sender.tab.id, result);
                });
            })
        }
        else {
            send_response(false);
        }


    }
)




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