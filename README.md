
# IstanbulTestCoverage
A website that allows people to create accounts and keep track of their daily symptoms for COVID-19.  
- **MongoDB** used as database
- **Bootstrap** used as CSS framework
- **Node.js** used as runtime environment
- **ExpressJS** was used for creating a webapp with Node.js
- Unit tests were written in Java using **JUnit**
- Test coverage was calculated using **Istanbul**

## Requirements
- Have MongoDB installed. In MacOS this can be achieved with the commands: 

    `brew tap mongodb/brew`

    `brew install mongodb-community@4.2`

    Detailed instructions can be found [here](https://docs.mongodb.com/manual/administration/install-community/)

- Create a database called "covid_app" in mongo and create a collection called "users":

    `brew services start mongodb-community@4.2` 

    `mongo`

    `use covid_app` (this will create the database if it does not exist)

    `db.createCollection('users')`

- Download the npm packages:

    `npm i express`

    `npm i express-session`

    `npm i mongodb`

    `npm i body-parser`

    `npm i pug`

    `npm i istanbul`

- A webdriver (e.g. Chromedriver) is needed for unit tests 

## How to run

Start mongo services. In MacOS this can be done with the command:

`brew services start mongodb-community@4.2`

Then run the node.js application : 

`node app.js`

The server should start running and the webapp should be accessible through http://127.0.0.1:3000/

## Unit Tests and Test Coverage
 
 To calculate test coverage we need to first instrument our code. This can be done with the command:

`istanbul instrument app.js>instrumented.js`

Then run the instrumented code in coverage mode with: 

`istanbul cover instrumented.js`

After the webapp starts running, unit tests can be run. Once the tests have finished, the node application can be stopped. 

This should output coverage results to the terminal and create coverage reports that contain further details.
