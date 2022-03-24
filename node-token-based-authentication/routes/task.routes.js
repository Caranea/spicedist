const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/User");
const tokenSchema = require("../models/Token")
const taskSchema = require("../models/Task")

const authorize = require("../middlewares/auth");
const { check, validationResult } = require('express-validator');
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");

// Update User
router.route('/tasks/:id?').get((req, res, next) => {
  console.log('getting tassk...')
  console.log(req.params)
  if (req.params.id) {
    taskSchema.findById(req.params.id, (e, d) => {
      if (e) {
        return next(error);
        console.log(error)
      } else {
        return res.status(200).json(d)
      }
    })} else {
       taskSchema.find((e, d) => {
         if (e) {
           return next(error);
           console.log(error)
         } else {
           return res.status(200).json(d)
         }
       })
    }
  });


module.exports = router;
