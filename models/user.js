import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

//Define the model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// onSave hook, encrypt password
userSchema.pre('save', function(next) {
  const user = this; // user is an instance of the user Model
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// WHY function is necessary () => {}????
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    return callback(null, isMatch);
  });
}

//Create model class
const ModelClass = mongoose.model('user', userSchema);
module.exports = ModelClass;

//Export the model
