// import passport from 'passport';
const passport = require('passport');
import User from '../models/user';
import { config } from '../config';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
// import { ExtractJwt } from 'passport-jwt';
// import { JwtStrategy } from 'passport-jwt';
// import { LocalStrategy } from 'passport-local';

// Create a local Strategy
const localLogin = new LocalStrategy({ usernameField: 'email' },
  (email, password, done) => {
    // Verify email password call Done with the user if correct
    // Otherwise call false
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      // compare password
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }
);

// setup option for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }
    if (user) {
      done(null, user);
    } else { done(null, false); }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
