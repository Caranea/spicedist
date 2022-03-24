const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/User");
const tokenSchema = require("../models/Token")
const authorize = require("../middlewares/auth");
const { check, validationResult } = require('express-validator');
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const mongoose = require('mongoose');

// Update User
router.route('/update-user/:id').put(authorize, (req, res, next) => {
    userSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            return res.json(data)
            console.log('User successfully updated!')
        }
    })
});


// Delete User
router.route('/delete-user/:id').delete(authorize, (req, res, next) => {
    userSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            return res.status(200).json({
                msg: data
            })
        }
    })
});
//dashboard
router.route('/user-dashboard/:id').get((req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                tasks: data.finishedTasks,
                id: data._id,
                name: data.name
            })
        }
    })
})
router.route('/user-dashboard/:id/assignTask').post(async (req, res, next) => {
    let user = await userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        }
    })
    console.log(user)
    
    req.body._id = new mongoose.Types.ObjectId();
    user.assignedTasks.push(req.body)
    console.log(user)
    await user.save();
    res.status(200).json({msg: 'success'})
})

module.exports = router;
