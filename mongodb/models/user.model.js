

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { SALT_WORK_FACTOR } = require('../../utils/constants');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true },
  password: { type: String, required: true },
  token: { type: String, default: '' },
  isAvailable: { type: Boolean },
}, { timestamps: true });


UserSchema.pre('save', function (next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.pre('update', function (next) {
    const user = this
    // only hash the password if it has been modified (or is new)
    // user.isModified is not avaialable for findOneAndUpdate
    const password = _get(user, '_update.$set.password');
    if (!password) return next()
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err)

        // hash the password using our new salt
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) return next(err)

            // override the cleartext password with the hashed one
            user._update.$set.password = hash
            next()
        })
    })
})



//to compare password
UserSchema.methods.comparePassword = function (password) {

    return bcrypt.compareSync(password, this.password);

}

module.exports = mongoose.model('user', UserSchema, 'user');
