console.log("Server running at http://127.0.0.1:3000/");
const { readFileSync } = require('fs');

// Express
const express = require('express');
const app = express();

//use sessions for tracking logins
var session = require('express-session');
app.use(session({
    secret: 'workhard',
    resave: true,
    saveUninitialized: false
}));

// Mongo
const MongoClient = require('mongodb');
const url = 'mongodb://localhost:27017';

// Body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.get('/protected_page', function(req, res){
    res.render('protected_page', {username: req.session.user.username})
});

// Create
app.post('/create', function (req, res) {
    // Create record
    var userData = {
        username: req.body.new_username,
        password: req.body.new_password,
        age: req.body.age,
        gender: req.body.gender
    };

    // Add record to database
    MongoClient.connect(url, function(err, client) {
        const db = client.db("covid_app");
        const collection = db.collection('users');
        if (err) throw err;
        collection.insertOne(userData, function(error, result) {
            if (error){
                res.status("400");
                res.send("Invalid details!");
                throw error;
            }
            else{
                console.log("Inserted document into the collection");
                req.session.user = data;
                res.redirect('/protected_page');
            }
        });
    });
});

// Login
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
        collection.findOne(userData, function(err, data) {
            if (data && !err) {
                req.session.user = data;
                console.log(data);
                res.redirect('/profile');
                //res.redirect('/protected_page');
            } else {
                console.log(err);
                res.redirect('/');
            }
        });
    });
});

// Main page
app.get('/', function (req, res) {
    res.send(readFileSync('./main.html', 'utf8') );
});

// Profile page
app.get('/profile', function (req, res) {
    res.send(readFileSync('./profile.html', 'utf8') );
});

// Test
app.post('/test', function (req, res) {
    console.log("alo");
    console.log(req.session);
    console.log("bb");
});

app.listen(3000);
