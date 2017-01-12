
const Authentication = require('./controllers/authentication');
const jwtLogin = require('./services/passport').jwtLogin;
const localLogin = require('./services/passport').localLogin;
const passport = require('passport');

//tell passport to use jwtLogin strategy.
passport.use(jwtLogin);
passport.use(localLogin);

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {

  app.get('/', requireAuth, function(req, res, next) {
    res.send({message: "Token verifed!!!"});
  });

  app.post('/signin',requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup);

}
