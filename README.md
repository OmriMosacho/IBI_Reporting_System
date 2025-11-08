# IBI Reporting System

This project holds the Backend, Frontend and a Database instance of the IBI reporting system.

## The System Design Document
    https://docs.google.com/document/d/1unCIzitnXD2iHZKchlufV95i2WZXiNRTxoyh7SUWYiw/edit?usp=sharing

## App Requirements
## Backend: NodeJS 25, Express, JWT, bcrypt, cors, dotenv, pg, jest, jsdoc, docdash
Run in the Backend directory: 
### npm install

#
## Frontend: react 18, axios, jest, jsdoc, docdash
Run in the Backend directory: 
### npm install

## Running the project after installing all dependencies:
    1. Restoring the DB:
        a. Download the 'reporting_db.sql' located in the project directory.
        b. In your PostgreSQL 16, create a new DB called reporting_db.
        c. Restore DB from the downloaded file ('reporting_db.sql').
    2. Run Backend (assuming npm install was running before):
        a. In the cmd, navigate to the 'Backend' directory.
        b. run command: npm run start
    3. Run Frontend (assuming npm install was running before):
        a. In a different cmd, navigate to the 'frontend' directory.
        b. run command: npm run start

## App Documentation
    The App documentation is divided to Backend documentation and Frontend documentation.
    1. Show Backend documentation:
        a. In the cmd, navigate to the 'Backend' directory.
        b. Run command: npm run doc
        c. Navigate to the doc folder in the 'Backend' directory, open the index.html with the browser. 
    2. Show Frontend documentation:
        a. In the cmd, navigate to the 'frontend' directory.
        b. Run command: npm run doc
        c. Navigate to the doc folder in the 'frontend' directory, open the index.html with the browser. 

## Testing
    The App testing is a basic tests, destined to showcase test abilities in small and big projects, scalable and easy to maintain.
    All tests are located in the __tests__ folder under the frontend directory.
    To run the tests, run command: npm run test