__author__ = "Kyler Greenway" 
__date__ = "November 2022" 

import json
from flask import Flask, request
import Database as db

app = Flask(__name__)


#New User Request 
@app.route("/newUser", methods = ['GET', 'POST'])
def new_user():
    
    uid = request.args.get('uid', None)
    password = request.args.get('password', None)
    
    api_key = db.newUser(uid,password) #langstons new user method 

    return {"key": api_key}

#Is valid login Request 
@app.route('/isValidLogin', methods = ['GET', 'POST'])
def is_valid_login():

    uid = request.args.get('uid', None)
    password = request.args.get('password', None)
    
    api_key = db.isValidLogin(uid,password) #langtons is valid user method

    return {"key": api_key}

#User exists Request 
@app.route('/userExists', methods = ['GET', 'POST'])
def user_exists():
    
    uid = request.args.get('uid', None)

    exists = db.userExist(uid) #langstons user exits method 

    return {"bool":exists}


#Get Login Request 
@app.route('/getLogin', methods = ['GET', 'POST'])
def get_login():
    
    uid = request.args.get('uid', None)
    website = request.args.get('website', None)
    api_key = request.args.get('apiKey', None)

    uname, password = db.getLogin(uid, website, api_key) #langstons get login method
    login = {"user":uname, "pass": password}


    return login

#Set Login Request 
@app.route('/setLogin', methods = ['GET', 'POST'])
def set_login():
    uid = request.args.get('uid', None)
    website = request.args.get('website', None)
    user = request.args.get('user', None)
    password = request.args.get('password', None)
    api_key = request.args.get('apiKey', None)

    login = db.setLogin(uid, website, user, password, api_key) #langstons set method

    return {"bool" : True} 

#Create Login Request 
@app.route('/createLogin', methods = ['GET', 'POST'])
def create_login():
    
    uid = request.args.get('uid', None)
    website = request.args.get('website', None)
    user = request.args.get('user', None)
    api_key = request.args.get('apiKey',None)

    password = db.createLogin(uid, website, user, api_key) # langstons create user method

    return {"bool":True }

db.initialize()

