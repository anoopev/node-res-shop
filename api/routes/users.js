const express = require('express');

const router = express.Router();

const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

// POST route to create new User
router.post('/signup', UserController.user_signup);

// POST login user
router.post('/login', UserController.user_login);


// DELETE user
router.delete('/:userId', checkAuth, UserController.user_delete);


module.exports = router;