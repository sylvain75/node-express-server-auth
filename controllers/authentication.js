import jwt from 'jwt-simple';
import User from '../models/user';
import { config } from '../config';

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

export const signin = (req, res, next) => {
  // User has already had email /password auth'd
  // Just need to give a token
  console.log("????", req.user);
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a user with given email exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    // If a user with email exist, return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }
    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email,
      password
    });

    user.save((err) => {
      if (err) {
        return next(err);
      }
      // Respond to request indicationg the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
  // res.send({ success: 'true' });
};
