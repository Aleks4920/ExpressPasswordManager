var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Password = new Schema({
    username: String,
    password: String,
    website: String,
    email: String,
    notes: String
});

// var passwordSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     website: String,
//     email: String,
//     notes: String
// });


Password.plugin(passportLocalMongoose);

module.exports = mongoose.model('Password', Password);

