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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Pug
app.set('view engine', 'pug');

// Profile page using pug template
app.get('/protected_page', function(req, res){
    var user_name = req.session.user.username;
    var user_age = req.session.user.age;
    var user_gender = req.session.user.gender;
    var user_symptoms = req.session.user.symptoms;
    var info = {username: user_name, age: user_age, gender: user_gender, symptoms: user_symptoms};
    res.render('protected_page', info)
});

// Create account
app.post('/create', function (req, res) {
    // Create record
    var userData = {
        username: req.body.new_username,
        password: req.body.new_password,
        age: req.body.age,
        gender: req.body.gender,
        symptoms : []
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
                req.session.user = userData;
                res.redirect('/protected_page');
            }
        });
    });
});

// Login
app.post('/login', function (req, res) {
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
                //res.redirect('/profile');
                res.redirect('/protected_page');
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

// Profile page todo delete
app.get('/profile', function (req, res) {
    res.send(readFileSync('./profile.html', 'utf8') );
});

// Monitor symptoms
app.post('/monitor', function (req, res) {
    //todo
    res.redirect('/protected_page');
});

// Add symptom
app.post('/add', function (req, res) {
    // Add symptoms to user
    MongoClient.connect(url, function(err, client) {
        const db = client.db("covid_app");
        const collection = db.collection('users');
        if (err) throw err;
        var symptom = {date: req.body.date, symptom: req.body.symptom};
        collection.updateOne({username: req.session.user.username}
            , { $push: {symptoms:symptom}}, function(err, result) {
                if(err) throw err;
            });
    });
    // Go back to profile page
    res.redirect('/protected_page');
});

app.listen(3000);
console.log("Server running at http://127.0.0.1:3000/");
