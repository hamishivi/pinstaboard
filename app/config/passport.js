'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    passport.use(new TwitterStrategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: "https://pinstaboard-hamishivi.c9users.io/auth/twitter/callback"
  },
    function (request, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'twitter.id': profile.id }, function (err, user) {
                if (err) {
                    return done(err);
                }

               if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.twitter.id = profile.id;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};