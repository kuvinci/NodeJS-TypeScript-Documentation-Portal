const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/User');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const { registerValidators } = require('../utils/validators');
const router = Router();

const transporter = nodemailer.createTransport(
    sendgrid({
        auth: { api_key: keys.SENDGRID_API },
    })
);

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login/Register',
        isLogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError'),
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const candidate = await User.findOne({ email: email });
        if (!candidate) {
            req.flash('loginError', "User doesn't exist");
            res.redirect('/auth/login');
        }

        const isSame = await bcrypt.compare(password, candidate.password);
        if (!isSame) {
            req.flash('loginError', 'Wrong password');
            res.redirect('/auth/login');
        }

        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
            if (err) {
                throw err;
            }
            res.redirect('/');
        });

    } catch (error) {
        console.log(error);
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const { email, username, name, password, confirm_password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            username,
            name,
            password: hashPassword,
            bestPractices: { IDs: [] },
        });
        await user.save();
        await transporter.sendMail(regEmail(email));
        res.redirect('/auth/login');
    } catch (error) {
        console.log(error);
    }
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password?',
        error: req.flash('error'),
    });
});

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (!user) {
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Reset password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token,
            });
        }
    } catch (e) {
        console.log(e);
    }
});

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash(
                    'error',
                    'Something went wrong, please try again a bit later'
                );
                return res.redirect('/auth/reset');
            }

            const token = buffer.toString('hex');
            const candidate = await User.findOne({ email: req.body.email });

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login');
            } else {
                req.flash('error', "Email doesn't exist");
                res.redirect('/auth/reset');
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        } else {
            req.flash('loginError', 'The token has expired');
            res.redirect('/auth/login');
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;