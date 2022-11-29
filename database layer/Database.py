from cryptography.fernet import Fernet
import sqlite3

def initialize():
    temp = """
        create table logInfo(
	        uid TEXT, 
	        pmpword TEXT,
	        apiKey TEXT, 
	        PRIMARY KEY(apiKey)
        );

        create table pManager(
	        uid TEXT, 
	        website TEXT, 
	    uname TEXT, 
	    pword TEXT, 
	    PRIMARY KEY(uid, website), 
	    FOREIGN KEY(uid) REFERENCES logInfo(uid)
    );
    """
    print(temp)


# @param uid String that is username of new user
# @param pword String that is a password of new user 
# @return api is a String apiKey that the user needs to use to login
def newUser(uid, pword,):
    api = Fernet.generate_key()
    cypher = Fernet(api)
    cid = cypher.encrypt(uid)
    cword = cypher.encrypt(pword)
    print(cid + ',' + cword + ',' + api)
    return api

# @param uid is A possible username 
# @return boolean if username matches a username that already exist in the database
def userExist(uid): 
    #select uid from logInfo
    uidList = {"langstona", "kylerg", "owenl"} #temp

    #select apiKey from logInfo
    apiList = {"dajfhdajfh", "jdfho9we8r", "nvdughrj8"} #temp

    for x in uidList.__sizeof__:
        cypher = Fernet(apiList[x])
        uidTemp = uidList[x]
        if uidTemp == uid:
            return True
    
    return False

# @param uid String that is a possible username
# @param pword String that is a possible password
# @param api String that is valid key from the user
# @return boolean if the uid and pword matches a pair from database with the same apiKey 
def isVaildLogin(uid, pword, api):
    cypher = Fernet(api)
    #select uid from logInfo where apiKey == api
    tempUid = cypher.decrypt() #uid from database
    
    #select pmpword from logInfo where apiKey == api
    tempPword = cypher.decrypt() #pword from database
    
    if(uid == tempUid and tempPword == pword):
        return True
    else:
        return False


def getLogin(uid, website, api):
    #select uname from pManager where website = website
    uname = "laron" #temp

    #select pword from pManager where website = website
    pword = "Password#123"

    return uname,pword
