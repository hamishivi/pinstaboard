'use strict';

var path = process.cwd();
var bodyParser = require('body-parser');
var User = require('../models/users');
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
    app.route('/', function (req, res) {
        res.locals.login = req.isAuthenticated();
        res.render(path + '/public/index.ejs');
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
};