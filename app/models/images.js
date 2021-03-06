'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    description: String,
    imageurl : String,
    creator: String,
    creatorid: String,
    creatorimage: String
});

module.exports = mongoose.model('Image', Image);