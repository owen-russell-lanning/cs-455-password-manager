# Locksmith Password Manager
## About
Locksmith is a barebones, multiple-user password manager. It has a python-based web-server (flask) and a browser extension built for chromium browsers. It uses SQLite for it's database. The extension include manual password storage and autofill for some sites.

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
This is browser depdendent. This guide will follow the chrome browser. However, the extension should work on any chromium browser using manifest v3 (opera, edge, etc).\
Open chrome and click on the three vertical dots in the top right. Go to more tools and then extensions. A new page should open.\
Enable developer mode in the top right.\
Click the load unpacked button in the top left.\
Select the build/extension directory\
The extension should now be enabled.

## Warning
Do not use in a professional enviroment. Prone to SQL Injection



