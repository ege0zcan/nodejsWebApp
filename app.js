console.log("Server running at http://127.0.0.1:3000/");
const { readFileSync } = require('fs');

// Express
const express = require('express');
const app = express();

// Mongo
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

// Body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//POST route for updating data
app.post('/create', function (req, res) {
    // Create record
    var userData = {
        username: req.body.new_username,
        password: req.body.new_password,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender
    };

    // Add record to database
    MongoClient.connect(url, function(err, client) {
        const db = client.db("covid_app");
        const collection = db.collection('users');
        if (err) throw err;
        collection.insertOne(userData, function(error, result) {
            if (err) throw err;
            console.log("Inserted document into the collection");
        });
    });

    res.redirect('/profile');
});

//POST route for updating data
app.post('/login', function (req, res) {
console.log("login");
    var userData = {
        username: req.body.username,
        password: req.body.password,
    };

    MongoClient.connect(url, function(err, client) {
        const db = client.db("covid_app");
        const collection = db.collection('users');
        if (err) throw err;
        collection.insertOne(userData, function(error, result) {
            if (err) throw err;
            console.log("Inserted document into the collection");
        });
    });
    res.redirect('/profile');
});

// Main page
app.get('/', function (req, res) {
    res.send(readFileSync('./main.html', 'utf8') );
});

app.get('/profile', function (req, res) {
    res.send(readFileSync('./main.html', 'utf8') );
});

app.listen(3000);



