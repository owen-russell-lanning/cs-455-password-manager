# Locksmith Password Manager
## About
Locksmith is a barebones, multiple-user password manager. It has a python-based web-server (flask) and a browser extension built for chromium browsers. It uses SQLite for it's database.

## Authors
Owen Russell-Lanning\
Langston Aron\
Kyler Greenway

## Installation
Clone the build directory to your local machine. Make sure you have python 3 installed alongside the flask and fernet packages. 

### Server Setup
cd into the build/server directory.\
If you wish to run the server and client on the same machine use the following command to start the server.
```
python -m flask --app api.py run
```
Other flask arguments may be required to start on a remote server. The server runs on port 5000 by default.

### Extension Setup

## Warning
Do not use in a professional enviroment. Prone to SQL Injection



