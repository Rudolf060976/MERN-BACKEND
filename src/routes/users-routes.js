const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const usersControllers = require('../controllers/users-controllers');

const fileUpload = require('../middleware/file-upload');

router.get('/', usersControllers.getUsers);


router.post('/signup',
fileUpload.single('image'),
[
    body('name').notEmpty(),
    body('email').notEmpty().normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 })
],
usersControllers.signup);



router.post('/login',
[
    body('email').notEmpty(),
    body('password').notEmpty().normalizeEmail().isEmail()
],
usersControllers.login);


module.exports = router;