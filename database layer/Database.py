from cryptography.fernet import Fernet
import sqlite3
import random, string

globalAPI = Fernet.generate_key()

#Creates tables of logInfo and pManager
def initialize():

    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS logInfo;")
    cur.execute("DROP TABLE IF EXISTS pManager;")
    cur.execute("""
        create table logInfo(
	        uid TEXT, 
	        pmpword TEXT,
	        apiKey TEXT, 
	        PRIMARY KEY(apiKey)
        );
    """)
    cur.execute("""
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
    api = Fernet.generate_key()
    cypher = Fernet(globalAPI)
    enword = cypher.encrypt(pword.encode('utf-8'))
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    pwordDb = str(enword.decode())
    insert = "INSERT INTO logInfo VALUES (?, ?, ?);"
    dbTuple = (uid, pwordDb, api)
    cur.execute(insert, dbTuple)
    conn.commit()
    conn.close()
    return api

# Checks if user already exist in database
# @param uid is A possible username 
# @return boolean True if uid matches any on the database otherwise false
def userExist(uid): 
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    #select uid from logInfo where uid = uid; 
    select = "SELECT uid FROM logInfo WHERE uid = ?;"
    cur.execute("SELECT uid FROM logInfo WHERE uid = \'" + uid + "\';")
    dbuid = cur.fetchone()
    conn.commit()
    conn.close()
    return dbuid is not None

# Checks if the uid and pword are in the database
# @param uid String that is a possible username
# @param pword String that is a possible password
# @param api String that is valid key from the user
# @return boolean if the uid and pword matches a pair from database with the same apiKey 
def isValidLogin(uid, pword): #Change to have global variable 
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    cypher = Fernet(globalAPI)
    #select uid from logInfo 
    cur.execute("SELECT uid,pmpword FROM logInfo WHERE uid =\'" + uid + "\';")
    db =  cur.fetchone() #uid from database
    print(db)
    tfUid = False
    conn.commit()
    conn.close()
    if(db[0] == uid):
        tfUid = True
    
    dbpw = str(cypher.decrypt(db[1]).decode())
    tfPword = False
    if(dbpw == pword):
        tfPword = True
    
    return tfUid and tfPword

# Get users login info(username, password) for website 
# @param uid String username for login for database
# @param website String that will 
def getLogin(uid, website, api):
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    locCypher = Fernet(api)
    #select uname from pManager where website = website
    cur.execute("SELECT uname FROM pManager WHERE uid = \'" + uid + "\' AND website = \'" + website + "\';")
    uname = ''.join(cur.fetchone())

    #select pword from pManager where website = website
    cur.execute("SELECT pword FROM pManager WHERE uname = \'" + uname + "\' AND website = \'" + website + "\';")
    pword = locCypher.decrypt(''.join(cur.fetchone()).encode('utf-8')).decode('utf-8')

    conn.commit()
    conn.close()

    return uname,pword

def setLogin(uid, website, uname, pword, api):
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    locCypher = Fernet(api)
    enword = locCypher.encrypt(pword.encode())
    print(enword)
    pwordDb = enword.decode()
    print(pwordDb)
    insert = "INSERT INTO pManager VALUES (?, ?, ?, ?);"
    dbTuple = (uid, website, uname, pwordDb)
    cur.execute(insert, dbTuple)
    conn.commit()
    conn.close()

def createLogin(uid, website, uname, api):
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    locCypher = Fernet(api)
    pword = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))
    enword = locCypher.encrypt(pword.encode('utf-8'))
    pwordDb = str(enword.decode())
    insert = "INSERT INTO pManager VALUES (?, ?, ?, ?);"
    dbTuple = (uid, website, uname, pwordDb)
    cur.execute(insert, dbTuple)
    conn.commit()
    conn.close()
    return pword
