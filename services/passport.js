
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');
const User = require('../models/user');
const LocalStrategy = require('passport-local');


/*
    passport is more like an ecosystem. There are multiple login strategies which can be used with passport.
    Ex: strategy to authenticate with JWT token, strategy to authenticate with userName/Password, 
    strategy to authenticate with twitter/facebook
*/


//it pulls the email and password properties from the request.
const localOptions = {
    usernameField: 'email',
    passwordField: 'password',
};

module.exports.localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({email: email}, function(err, user) {
        if(err) { return done(err, false); }

        if(!user) {
            return done(null, false);
        }
        //check if the provided password is correct.
        user.comparePassword(password, function(err, isMatch) {
            if(err) { done(err); }
            if(!isMatch) { return done(null, false); }
            
            return done(null, user)
        });
    });
}); 


//setup options for jwt Strategy
//take the payload from header.
const jwtOptions = { 
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')  
 };


//create JWT Strategy
module.exports.jwtLogin = new JwtStrategy( jwtOptions, function( payload, done) { //payload is the decrypted JWT token. {sub, iat}
    //check if the user exists
    User.findById(payload.sub, function(err, user) {
        //error with fetching the user fron DB.
        if(err) { return done(err, false); }

        //user exists, authenticated. call done with the user.
        if(user) {
            return done(null, user);
        }
        else {  //user does not exist. NOT authenticated.
            return done(null, false);
        }
    });
})


//tell passport to use this strategy
//passport.use(jwtLogin);
