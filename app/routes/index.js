'use strict';

var path = process.cwd();
var bodyParser = require('body-parser');
var User = require('../models/users');
var Image = require('../models/images');
var mongoose = require('mongoose');

// Just use the default promise library
mongoose.Promise = global.Promise;

module.exports = function (app, passport) {
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.send('You gotta login before you can access this!');
        }
    }
    

    app.set('view engine', 'ejs');

    app.get('/', function (req, res) {
        res.locals.login = req.isAuthenticated();
        res.locals.title = "PinstaBoard";
        if (res.locals.login) {
            res.locals.userid = req.user.twitter.uniqueUrl;
        }
        Image.find({}, function(err, data) {
            if (err) return err;
            //console.log(data);
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
        res.locals.title = "PinstaBoard";
        res.locals.login = req.isAuthenticated();
        if (req.isAuthenticated()) {
            res.locals.userid = req.user.twitter.uniqueUrl;
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
        newImage.creatorid = req.user.twitter.uniqueUrl;
        newImage.creatorimage = req.user.twitter.profileimage;
        newImage.save(function(err) {
            if (err) console.log(err);
            res.redirect('/');
        });
    });
    
    app.get('/delete/:imageid', isLoggedIn, function(req, res) {
        Image.findOneAndRemove({"_id":req.params.imageid, "creatorid": req.user.twitter.uniqueUrl}, function(err, data) {
            if (err) return err;
            res.redirect('/');
        });
    });
};