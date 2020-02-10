var passport = require('passport')
var BearerStrategy = require('passport-http-bearer').Strategy
var mysql = require('../mysql-helper')
var user = require('../models/user')

passport.use(new BearerStrategy(
    function(token, done) {
        user.getUserByToken(token)
        .then( (result) => {
            if (!result[0] || result[1].length == 0)
                return done(null, false, { message: "Invalid Token"});
            let authUser = JSON.parse(JSON.stringify(result[1][0]));
            return done(null, authUser);
        })
        .catch((result) => {
            return done(null, false, { message: "Error occurred"});
        });
    }
))