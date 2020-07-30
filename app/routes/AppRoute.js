const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/AuthController');

router.get('/login', function(req, res, next) {
    res.render('login')
})

router.get('/dashboard', AuthController.authenticate, AuthController.dashboard)

router.get('/index', AuthController.index)

router.get('/', AuthController.index)

router.get('/logout', AuthController.logout)

router.get('/signup', AuthController.signup)

router.post('/sendcode', AuthController.sendCode)

router.post('/verifycode', AuthController.verifyCode)

router.post('/checkmobile', AuthController.validateMobile)

router.post('/checkusername', AuthController.checkUsername)

router.post('/register', AuthController.validate('createUser'), AuthController.validateUsername, AuthController.register)

router.post('/login', AuthController.validate('loginUser'), AuthController.loginUser, passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res) {
    res.redirect('/dashboard')
});

module.exports = router