//new Strategy to use for passport
//not third party


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//access to the user models to authenticate()
const User = require('./models/user');

//using the local strategy in our code elsewhere
//with  verification method
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//sessions with passport need to de-serial serial
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());