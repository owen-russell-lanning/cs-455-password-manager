__author__ = "Kyler Greenway" 
__date__ = "November 2022" 

import json
from flask import Flask, jsonify, request
import Database as db

app = Flask(__name__)


#New User Request 
@app.route("/newUser", methods = ['GET', 'POST'])
def new_user():
    
    uid = request.args.get('uid', None)
    password = request.args.get('password', None)
    
    api_key =  db.newUser(uid,password) #langstons new user method 

    return jsonify(api_key)

#Is valid login Request 
@app.route('/isValidLogin', methods = ['GET', 'POST'])
def is_valid_login():

    uid = request.args.get('uid', None)
    password = request.args.get('password', None)
    
    api_key = db.isValidLogin(uid,password) #langtons is valid user method

    return jsonify(api_key)

#User exists Request 
@app.route('/userExists', methods = ['GET', 'POST'])
def user_exists():
    
    uid = request.args.get('uid', None)

    exists = db.userExist(uid) #langstons user exits method 

    return jsonify(exists)


#Get Login Request 
@app.route('/getLogin', methods = ['GET', 'POST'])
def get_login():
    
    uid = request.args.get('uid', None)
    website = request.args.get('website', None)
    api_key = request.args.get('apiKey', None)

    login = db.getLogin(uid, website, api_key) #langstons get login method

    return jsonify(login)

#Set Login Request 
@app.route('/setLogin', methods = ['GET', 'POST'])
def set_login():
    uid = request.args.get('uid', None)
    website = request.args.get('website', None)
    user = request.args.get('user', None)
    password = request.args.get('password', None)
    api_key = request.args.get('apiKey', None)

    login = None #langstons set method

    return jsonify(login)

#Create Login Request 
@app.route('/createLogin', methods = ['GET', 'POST'])
def create_login():
    
    uid = request.args.get('uid', None)
    website = request.args.get('website', None)
    user = request.args.get('user', None)
    api_key = request.args.get('apiKey',None)

    password = None # langstons create user method

    return jsonify(password)

db.initialize()

