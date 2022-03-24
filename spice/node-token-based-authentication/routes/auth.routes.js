// routes/auth.routes.js

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

// Sign-up
router.post("/register-user",
    [
        check('email', 'Email is required')
            .not()
            .isEmpty()
            .trim()
            .isEmail(),
        check('password', 'Password should be between 6 to 32 characters long')
            .not().isEmpty().escape()
            .isLength({ min: 6, max: 32 }),
        check('referrer')
            .trim().escape(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log('a;a', req.body);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
            console.log(errors)
        }
        else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
              console.log('were he')
                const user = new userSchema({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                });
                console.log(user)
                user.save().then((response) => {
                    res.status(201).json({
                        message: "User successfully created!",
                        result: response
                    });
                }).catch(error => {
                  if(!res.headersSent) {
                    console.log(error)
                    res.status(422).json({
                        error: error
                    }); }

                });
            });
        }
    });


// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
      console.log('a')
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response || getUser === undefined) {
            return res.status(401).json({
                message: "Authentication failed"
            });
            next();
        }
        console.log('c')
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "1h"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            _id: getUser._id
        });
    }).catch(err => {
        console.log('b')
        console.log(err)
        if(!res.headersSent) {
          return res.status(401).json({
            message: "Authentication failed"
        }); }

    });
});

// Get Users
router.route('/').get((req, res) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Single User
router.route('/user-profile/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})
// pasword remind
router.route('/update-password/:mail').get( async (req, res, next) => {
    console.log(req.params.mail)
    const user = await userSchema.findOne( {email: req.params.mail} );

    if (!user) {
      return res.status(422).json({
          message: "User does not exist"
      });
    }
    let token = await tokenSchema.findOne({ userId: user._id });
    if (token) {
          await token.deleteOne()
    };

    //create token

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(10));

    await new tokenSchema({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `46.101.153.180:4200/password-reset/${resetToken}/${user._id}`;
    sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"./template/requestResetPassword.handlebars");

    res.status(200).json({
        msg: 'Link sent'
    })
})
router.route('/reset-password/:userId/:token/:password').get( async (req, res, next) => {
    let passwordResetToken = await tokenSchema.findOne({ userId: req.params.userId });
    if (!passwordResetToken) {
      return res.status(422).json({
          message: "Invalid or expired password reset token"
      });
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      return res.status(422).json({
          message: "Invalid or expired password reset token"
      });
    }
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    console.log(hash)
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: userId });
    await passwordResetToken.deleteOne();
    return  res.status(200).json({
          msg: "Password Reset Successfully. Please go back to back to sign in page"
      });
});


module.exports = router;
