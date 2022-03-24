const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  proofType: {
    type: String, enum: ['photo', 'desc'],
    required: true,
  },
  timeToFinish: {
    type: Number,
    default: 86400000
    //24hrs in ms
  },
});
module.exports = mongoose.model("Task", taskSchema);
