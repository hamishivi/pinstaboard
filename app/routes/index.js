'use strict';

var path = process.cwd();
var bodyParser = require('body-parser');
var User = require('../models/users');
var Image = require('../models/images');
var mongoose = require('mongoose');

module.exports = function (app, passport) {
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.send('You gotta login before you can access this!');
        }
    }
    

    app.set('view engine', 'ejs');

    // need: list of bars with name, review, number going, imageurl
    app.get('/', function (req, res) {
        res.locals.login = req.isAuthenticated();
        if (req.isAuthenticated()) {
            res.locals.userid = req.user.twitter.id;
        }
        Image.find({}, function(err, data) {
            if (err) return err;
            console.log(data);
            res.locals.images = data;
            res.render(path + '/public/index.ejs');
        });
    });
    
    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', 
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
    });
    
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
    app.get('/user/:userid', function(req, res) {
        res.locals.login = req.isAuthenticated();
        if (req.isAuthenticated()) {
            res.locals.userid = req.user.twitter.id;
        }
        Image.find({'creatorid':req.params.userid}, function(err, data) {
            if (err) return err;
            res.locals.images = data;
            res.render(path + '/public/index.ejs');
        });
    });
    
    app.post('/addimage', isLoggedIn, function(req, res) {
        var newImage = new Image();
        newImage.imageurl = req.body.imageurl;
        newImage.description = req.body.description;
        newImage.creator = req.user.twitter.displayName;
        newImage.creatorid = req.user.twitter.id;
        newImage.save(function(err) {
            if (err) console.log(err);
            res.redirect('/');
        })
    });
};