var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var randomBytes = require("crypto").randomBytes;
var createCipheriv = require("crypto").createCipheriv;
var createDecipheriv = require("crypto").createDecipheriv;





router.get('/', function (req, res) {
    res.render('index', { user : req.user });

    // if user is logged in, redirect to /home
    if (req.user) {
        res.redirect('/passwords/home');
    }
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {

    // add account to database
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});



router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});


router.get('/logout', function(req, res) {
    req.logout(function(err){
        if (err) {
            console.log(err);
        } 
        res.redirect('/');
    });
});


router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
