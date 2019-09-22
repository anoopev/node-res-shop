const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

// POST route to create new User
router.post('/signup', (req, res, next) => {
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
});


module.exports = router;