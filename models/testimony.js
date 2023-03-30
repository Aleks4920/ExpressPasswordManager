

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Testimony = new Schema({
    name: String,
    testimony: String
});

Testimony.plugin(passportLocalMongoose);

module.exports = mongoose.model('Testimony', Testimony);

