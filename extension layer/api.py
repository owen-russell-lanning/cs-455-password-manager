__author__ = "Kyler Greenway" 
__date__ = "November 2022" 

import json
from flask import Flask, jsonify, request


app = Flask(__name__)


#New User Request 
@app.route("/newUser", methods = ['GET', 'POST'])
def new_user():
    
    uid = request.args.get('uid', None)
    password = request.args.get('password', None)
    
    api_key =  None #langsons new user method 

    return jsonify(api_key)

#Is valid login Request 
@app.route('/isValidLogin', methods = ['GET', 'POST'])
def is_valid_login():

    uid = request.args.get('uid', None)
    password = request.args.get('password', None)
    
    api_key = None #langtons is valid user method

    return jsonify(api_key)

#User exists Request 
@app.route('/userExists', methods = ['GET', 'POST'])
def user_exists():
    
    uid = request.args.get('uid', None)

    exists = None #langstons user exits method 

    return jsonify(exists)


#Get Login Request 
@app.route('/getLogin', methods = ['GET', 'POST'])
def get_login():
    
    uid = request.args.get('uid', None)
    website = request.args.get('website', None)
    api_key = request.args.get('apiKey', None)

    login = None #langstons get login method

    return jsonify(login)