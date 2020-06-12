//user schema
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   //deleted username/pass pass-local-mon handles
    admin: {
        type: Boolean,
        default: false
    }
});

//to use authenticate on route methods
userSchema.plugin(passportLocalMongoose);
//"users" User
module.exports = mongoose.model('User', userSchema);