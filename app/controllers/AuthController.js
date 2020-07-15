const { check, validationResult } = require('express-validator');
const Users = require('../model/UserModel');
const bcrypt = require('bcrypt');
const LocalStrategy = require("passport-local").Strategy
const passport = require("passport");
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

exports.signup = function(req, res) {
    res.render('signup2', { messages: {}, data: {}, error: {} });
}
exports.home = function(req, res) {
    res.render('home', { name: req.user })
}
exports.authenticate = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('login')
    }
}
exports.validate = (method) => {
    switch (method) {
        case 'createUser':
            {
                return [
                    check('username', 'Username is required').trim().escape().not().isEmpty()
                    .isLength({ min: 3 }).withMessage('Username must not less than 3 characters long')
                    .isLength({ max: 15 }).withMessage('Username must be less than 12 characters long'),
                    check('fullName', 'Full Name is required').trim().escape().not().isEmpty()
                    .matches(/^[a-zA-Z ]*$/).withMessage('Full Name must contain only Alphabets')
                    .isLength({ min: 5 }).withMessage('Full Name must not less than 3 characters long')
                    .isLength({ max: 30 }).withMessage('Full Name must be less than 50 characters long'),
                    check('email', 'Email is required').trim().escape().not().isEmpty().isEmail().normalizeEmail().withMessage('Your email is not valid')
                    .isLength({ max: 30 }).withMessage('Email must be less than 50 characters long'),
                    check('password', 'Password is required').trim().escape().notEmpty()
                    .isLength({ min: 6 }).withMessage('Password must be minimum 5 length')
                    .matches(/(?=.*?[A-Z])/).withMessage('Password must have at least one Uppercase')
                    .matches(/(?=.*?[a-z])/).withMessage('Password must have at least one Lowercase')
                    .matches(/(?=.*?[0-9])/).withMessage('Password must have at least one Number')
                    .matches(/(?=.*?[#?!@$%+^&*-])/).withMessage('password must have at least one special character'),
                    check('confirmPassword', 'Confirm Password is required').trim().escape().not().isEmpty().custom((value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error('Confirm Password does not match password');
                        }
                        return true;
                    }),
                    check('dob', 'dob is required').trim().escape().not().isEmpty()
                ]
            }
            break;
        case 'loginUser':
            {
                return [
                    check('phone', 'phone is required').trim().escape().not().isEmpty(),
                    check('password', 'Password is required').trim().escape().notEmpty()
                ]
            }
            break;
        case 'code':
            {
                return [
                    check('code').not().isEmpty()
                ]
            }
        default:
    }
}

exports.validateMobile = async function(req, res, next) {
    await Users.findAndCountAll({
            where: {
                mobile: req.body.mobile
            }
        })
        .then(async result => {
            console.log(result.count);
            if (result.count < 1) {
                res.send({
                    status: 200
                })
            } else {
                res.send({
                    status: 400
                })
            }
        }).catch(err => console.log(err));
}

exports.validateUsername = async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(req.body);
        res.render('signup2', { messages: {}, data: req.body, error: errors.mapped() })
    } else {
        await Users.findAndCountAll({
                where: {
                    username: req.body.username
                }
            })
            .then(async result => {
                console.log(result.count);
                if (result.count > 0) {
                    console.log('one match')
                    res.render('signup2', { messages: { 'usernameExist': 'Username already exist👻.' }, data: req.body, error: errors.mapped() })
                } else {
                    next()
                }
            }).catch(err => console.log(err));
        next;
    }
}

exports.checkUsername = async function(req, res) {
    await Users.findAndCountAll({
            where: {
                username: req.body.username
            }
        })
        .then(async result => {
            console.log(result.count);
            if (result.count > 0) {
                res.send({
                    success: false
                })
            } else {
                res.send({
                    success: true
                })
            }
        }).catch(err => console.log(err));
}

exports.register = async function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(req.body);
        res.render('signup2', { messages: {}, data: req.body, error: errors.mapped() })
    } else {
        await Users.create({
            mobile: req.body.phoneNumber,
            country: req.body.country,
            countryCode: req.body.countryCode,
            username: req.body.username,
            fullName: req.body.fullName,
            email: req.body.email,
            dob: req.body.dob,
            password: await bcrypt.hash(req.body.password, 10)
        }).then(result => {
            res.render('signup2', { messages: { 'success': 'Resgistered Successfully' }, data: {}, error: {} })
        }).catch(err => {
            res.render('signup2', { messages: { 'error': 'Error Occure! try again' }, data: req.body, error: errors.mapped() })
        });
    }
}
exports.loginUser = async function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', 'Please fill out the form properly')
        res.render('login', { data: req.body, error: errors.mapped() })
    } else {
        console.log(req.body)
        next();
    }
}

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('login');
}

exports.log = passport.use('login', new LocalStrategy({
        usernameField: 'phoneNumber',
        passwordField: 'password',
        passReqToCallback: true
    },

    function(req, username, password, done) {
        Users.findOne({
                where: {
                    mobile: username
                }
            })
            .then(async user => {
                if (await bcrypt.compare(password, user.password) == true) {
                    console.log('correct password')
                    req.flash('error', 'Please fill out the form properlypass')
                    return done(null, user);
                } else {
                    console.log('incorrect password')
                    return done(null, false, req.flash('error', 'Incorrect Password'));
                }
            })
            .catch(err => {
                console.log('record not found')
                return done(null, false, req.flash('error', 'Record not found'));
            })
        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser(function(user, done) {
            done(null, user);
        });
    }));

exports.sendCode = function(req, res, next) {
    var mobile = req.body.mobile;
    client.verify.services(process.env.SERVICE_SID)
        .verifications
        .create({ to: mobile, channel: process.env.CHANNEL })
        .then(result => {
            console.log(result.status)
            res.send({
                status: 200
            })
        }).catch(err => console.log(err));
}

exports.verifyCode = async function(req, res, next) {
    var mobile = req.body.mobile
    var code = req.body.code
    await client.verify.services(process.env.SERVICE_SID)
        .verificationChecks
        .create({ to: mobile, code: code })
        .then(verification_check => {
            if (verification_check.status == "approved") {
                res.send({
                    status: '200'
                })
            } else {
                res.send({
                    status: '400'
                })
            }
        }).catch(err => console.log(err));
}