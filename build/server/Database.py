from cryptography.fernet import Fernet
import sqlite3
import os
import random, string


#static api global key
globalAPI = str.encode('tlEmId8ieL-Qb6pH_tWvsIECs9pB0mS6jMCW0MN_zlA=') #Fernet.generate_key()
databaseFile = 'Password_Manager_Database.db' #path to the database file

#Creates tables of logInfo and pManager
def initialize():
    #check if database file already exists
    if not os.path.exists(databaseFile):
        conn = sqlite3.connect(databaseFile)
        cur = conn.cursor()
        cur.executescript("""
            create table logInfo(
                uid TEXT, 
                pmpword TEXT,
                apiKey TEXT, 
                PRIMARY KEY(apiKey)
                unique (uid)
            );

            create table pManager(
                uid TEXT, 
                website TEXT, 
                uname TEXT, 
                pword TEXT, 
            PRIMARY KEY(uid, website), 
            FOREIGN KEY(uid) REFERENCES logInfo(uid)
            );
        """)
        conn.commit()
        conn.close()

# Creates new user and places uid and pword onto the database encryting the pword 
# returning an API key for user to use in future.
# @param uid String that is username of new user
# @param pword String that is a password of new user 
# @return api is a String apiKey that the user needs to use to login
def newUser(uid, pword):
    api = Fernet.generate_key().decode()

    cypher = Fernet(globalAPI)
    enword = cypher.encrypt(pword.encode()).decode()
    conn = sqlite3.connect(databaseFile)
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO logInfo VALUES (\"" + uid + "\",\"" + enword + "\",\"" + api+ "\")")
        conn.commit()
        conn.close()
        return api
    except sqlite3.IntegrityError:
        #error. user most likely already exists
        conn.close()
        return False
     
        

   

# Checks if user already exist in database
# @param uid is A possible username 
# @return boolean True if uid matches any on the database otherwise false
def userExist(uid): 
    conn = sqlite3.connect(databaseFile)
    cur = conn.cursor()
    #select uid from logInfo where uid = uid; 
    cur.execute("SELECT uid FROM logInfo WHERE uid = \"" + uid + "\";")
    dbuid = cur.fetchone()
    conn.commit()
    conn.close()
    return dbuid != None and len(dbuid) != 0 and dbuid[0] == uid

# Checks if the uid and pword are in the database
# @param uid String that is a possible username
# @param pword String that is a possible password
# @param api String that is valid key from the user
# @return boolean if the uid and pword matches a pair from database with the same apiKey 
def isValidLogin(uid, pword): #Change to have global variable 
    conn = sqlite3.connect(databaseFile)
    cur = conn.cursor()
    cypher = Fernet(globalAPI)
    #select uid from logInfo 
    cur.execute("SELECT uid,pmpword,apiKey FROM logInfo WHERE uid = \"" + uid + "\";")
    db =  cur.fetchone() #uid from database
    tfUid = False
    conn.commit()
    conn.close()

    if db == None: #no results found, user does not exist
        return False

    if(db[0] == uid):
        tfUid = True
    
    dbpw = cypher.decrypt(db[1]).decode()
    tfPword = False
    if(dbpw == pword):
        tfPword = True
    
    if tfUid and tfPword:
        #return api key
        return db[2]
    else:
        return False

# Get users login info(username, password) for website 
# @param uid String username for login for database
# @param website String that will 
def getLogin(uid, website, api):
    conn = sqlite3.connect(databaseFile)
    cur = conn.cursor()
    api_bytes = bytes(api, 'utf-8')
    locCypher = Fernet(api_bytes)
    #select uname from pManager where website = website
    cur.execute("SELECT uname,pword FROM pManager WHERE uid = \"" + uid + "\" AND website = \"" + website + "\";")
    fetch = cur.fetchone()

    if fetch == None:
        return False #no login for website stored

    uname = fetch[0]
    pword = locCypher.decrypt(fetch[1]).decode()

    conn.commit()
    conn.close()

    return uname,pword

def setLogin(uid, website, uname, pword, api):
    conn = sqlite3.connect(databaseFile)
    cur = conn.cursor()
    locCypher = Fernet(bytes(api, 'utf-8'))
    enword = locCypher.encrypt(pword.encode()).decode()
    cur.execute("INSERT INTO pManager VALUES (\"" + uid + "\", \"" + website + "\", \"" + uname + "\", \"" + enword + "\")")
    conn.commit()
    conn.close()

def createLogin(uid, website, uname, api):
    conn = sqlite3.connect(databaseFile)
    cur = conn.cursor()
    locCypher = Fernet(api)
    pword = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))
    enword = locCypher.encrypt(pword)
    cur.execute("INSERT INTO pManager " + uid + ", " + website + ", " + uname + ", " + enword)
    conn.commit()
    conn.close()
    return pword
