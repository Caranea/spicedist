// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    referrer: {
        type: String,
        required: false
    },
    name: {
      type: String,
      required: false
    },
    currentTask: {
      type: Object,
      required: false
    },
    finishedTasks: {
      type: [Object],
      required: false
    },
    assignedTasks: {
      type: [Object],
      required: false
    },
    subscriptionId:{
      type: Schema.Types.Mixed,
      required: false
    }
}, {
    collection: 'users'
})

userSchema.plugin(uniqueValidator, { message: 'Email or username already in use.' });
module.exports = mongoose.model('User', userSchema)
