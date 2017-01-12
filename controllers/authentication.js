
const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  //sub: subject, iat: issued at time. This is the general convention.
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signup = function(req, res, next) {
  console.log(req.header);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'you must provide email and password'});
  }

  //check if a user with email already exists.
  User.findOne({ email: email }, function testingThis(err, existingUser) {
    if(err) {
      return next(err);
    }
    //if user does exist, return an error.
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    //if user does NOT exist, create and save record.
    //Mongoose Document can be considered as an instantiation of a Model.
    const user = new User({
      email: email,
      password: password
    });

    //respond to request saying user created.
    user.save(function(err) {
      if (err) { return next(err); }
      res.json( { token: tokenForUser(user) } );
    });

  });
}


//email and password are already authenticated before this.
//just need to generate a token and sent it back.
exports.signin = function(req, res, next) {
     
  res.json( { 
    message: "SignIn successful",
    token: tokenForUser(req.user) } 
  );
}