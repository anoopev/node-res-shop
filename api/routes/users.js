const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

// POST route to create new User
router.post('/signup', (req, res, next) => {
    // check if email already registered in the system
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            // check length ts, since response wil l be null array if not exists
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already registered!"
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log("New user created: ", result);
                                res.status(201).json({
                                    message: 'User created successfully!'
                                });
                            })
                            .catch(err => {
                                console.log("Error creating user: ", err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

// POST login user
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed!'
                });
            }
            else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed!"
                        });
                    }
                    else if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            });
                        return res.status(200).json({
                            message: "Auth successful!",
                            token: token
                        });
                    }
                    else {
                        res.status(401).json({
                            message: "Auth failed!"
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.log("Error when signing in: ", err);
            res.status(500).json({
                error: err
            });
        });
})


// DELETE user
router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted!'
            });
        })
        .catch(err => {
            console.log("Error when deleting user: ", err);
            res.status(500).json({
                error: err
            });
        });
})


module.exports = router;