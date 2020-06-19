//new Strategy to use for passport
//not third party


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//access to the user models to authenticate()
const User = require('./models/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt; //extract jw token from request object
const jwt = require('jsonwebtoken'); //for making,signing, create, verify tokens

const FacebookTokenStrategy = require('passport-facebook-token');



const config = require('./config.js');

//using the local strategy in our code elsewhere with  verification method
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//sessions with passport need to de-serial serial
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//contain id for user document
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

//strategy for JWT
const opts = {};
//how server extracts or reads token (in header)
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

//exporting Strategy
exports.jwtPassport = passport.use(
    new JwtStrategy (
        opts,
        //how to write verify function
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null,user);
                } else {
                    return done (null, false);
                }
            //can make new account here
            });

        }
    )
);

//shortcut using verifyUser for further uses instead of retyping this line
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin === true) {
       return next();
    } else {
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
}

//similar to JWT strategy
exports.facebookPassport = passport.use(
    new FacebookTokenStrategy(
        {
            clientID: config.facebook.clientId,
            clientSecret: config.facebook.clientSecret
        },
        (accessToken, refreshToken, profile, done) => {
            //facebook id is from authenticate
            User.findOne({facebookId: profile.id}, (err, user) => {
                if(err) {
                    return done(err, false);
                }
                if (!err && user) {
                    return done(null, user);
                } else {
                    user = new User( { username: profile.displayName } );
                    //extracting fb profile info to create a new User for DB
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        }
    )
)
