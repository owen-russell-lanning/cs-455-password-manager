from cryptography.fernet import Fernet
import sqlite3

globalAPI = Fernet.generate_key()

def initialize():

    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    cur.execute("""
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
    """)
    conn.commit()
    conn.close()



# @param uid String that is username of new user
# @param pword String that is a password of new user 
# @return api is a String apiKey that the user needs to use to login
def newUser(uid, pword):
    api = Fernet.generate_key()
    cypher = Fernet(globalAPI)
    enword = cypher.encrypt(pword)
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    cur.execute("INSERT INTO logInfo VALUES (" + uid + "," + enword + "," + api+ ")")
    conn.commit()
    conn.close()
    return api

# @param uid is A possible username 
# @return boolean if username matches a username that already exist in the database
def userExist(uid): 
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    #select uid from logInfo
    cur.execute("SELECT uid FROM logInfo;")
    uidList = cur.fetchall
    conn.commit()
    conn.close()
    for x in uidList:
        cypher = Fernet(globalAPI)
        uidTemp = cypher.decrypt(x)
        if uidTemp == uid:
            return True
    return False

# @param uid String that is a possible username
# @param pword String that is a possible password
# @param api String that is valid key from the user
# @return boolean if the uid and pword matches a pair from database with the same apiKey 
def isVaildLogin(uid, pword): #Change to have global variable 
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    cypher = Fernet(globalAPI)
    #select uid from logInfo 
    cur.execute("SELECT uid FROM logInfo WHERE uid = " + uid + ";")
    dbuid =  cur.fetchone() #uid from database
    tfUid = False
    if(dbuid == uid):
        tfUid = True
    
    #select pmpword from logInfo 
    cur.execute("SELECT pmpword FROM logInfo WHERE pmpword = "+ pword + ";")
    dbpw = cur.fetchone() #pmpword from database

    conn.commit()
    conn.close()

    tfPword = False
    if(dbpw == pword):
        tfPword = True
    
    return tfUid and tfPword
    
def getLogin(uid, website, api):
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    locCypher = Fernet(api)
    #select uname from pManager where website = website
    cur.execute("SELECT uname FROM pManager WHERE uid = " + uid + "AND website = " + website + ";")
    uname = cur.fetchone()

    #select pword from pManager where website = website
    cur.execute("SELECT pword FROM pManager WHERE uname = " + uname + "AND website = " + website + ";")
    pword = locCypher.decrypt(cur.fetchone)

    conn.commit()
    conn.close()

    return uname,pword

def setLogin(uid, website, uname, pword, api):
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    locCypher = Fernet(api)
    enword = locCypher.encrypt(pword)
    cur.execute("INSERT INTO pManager " + uid + ", " + website + ", " + uname + ", " + enword)
    conn.commit()
    conn.close()

def createLogin(uid, website, uname, api):
    conn = sqlite3.connect('Password_Manager_Database')
    cur = conn.cursor()
    locCypher = Fernet(api)
    pword = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))
    enword = locCypher.encrypt(pword)
    cur.execute("INSERT INTO pManager " + uid + ", " + website + ", " + uname + ", " + enword)
    conn.commit()
    conn.close()
    return pword
    
