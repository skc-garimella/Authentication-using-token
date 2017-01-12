
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

//Define model.
/*
  Mongoose Schema is a set of rules that define what fields a document may have and 
  rules that the fields need to satisfy for them to be considered valid. 
*/
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

//before saving the model, run this function.
//encrypt the password using bcrypt before saving it to mongodb.
userSchema.pre('save', function(next) {
  const user = this; //this here will be an instance of userModel.

  //salt 
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err); }

    //encrypt the password with the hash.
    bcrypt.hash( user.password, salt, null, function(err, hashedValue) {
      if(err) { return next(err); }
      //replace the password with the hashed password
      user.password = hashedValue;
      next();
    });
  });
});


userSchema.methods.comparePassword = function(enteredPassword, callback) {
  bcrypt.compare(enteredPassword, this.password, function(err, isMatch) {
    if(err) { return callback(err) }

    callback(null, isMatch);
  });
}

//create the model class
/* 
  On a high level, Model is a combination of a Schema and a Connection.
  Mongoose automatically 'pluralizes' the model name
  So, user refers to the users collection in mongodb. 
  Mongoose Document can be considered as an instantiation of a Model.
*/
const userModel = mongoose.model('user', userSchema); 


//export the model.
module.exports = userModel;
