"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
// import sendgrid from 'nodemailer-sendgrid-transport';
const User_1 = __importDefault(require("../models/User"));
// import keys from '../keys';
// import regEmail from '../emails/registration';
// import resetEmail from '../emails/reset';
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
// const transporter = nodemailer.createTransport(
//     sendgrid({
//         auth: { api_key: keys.SENDGRID_API },
//     })
// );
router.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('auth/login', {
        title: 'Login/Register',
        isLogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError'),
    });
}));
router.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const candidate = yield User_1.default.findOne({ email: email });
        if (!candidate) {
            req.flash('loginError', "User doesn't exist");
            res.redirect('/auth/login');
        }
        if (candidate) {
            const isSame = yield bcryptjs_1.default.compare(password, candidate.password);
            if (!isSame) {
                req.flash('loginError', 'Wrong password');
                res.redirect('/auth/login');
            }
        }
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
            if (err) {
                throw err;
            }
            res.redirect('/');
        });
    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/register', validators_1.registerValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, name, password, confirm_password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({
            email,
            username,
            name,
            password: hashPassword,
            bestPractices: { IDs: [] },
        });
        yield user.save();
        // await transporter.sendMail(regEmail(email));
        res.redirect('/auth/login');
    }
    catch (error) {
        console.log(error);
    }
}));
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password?',
        error: req.flash('error'),
    });
});
router.get('/password/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }
    try {
        const user = yield User_1.default.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() },
        });
        if (!user) {
            return res.redirect('/auth/login');
        }
        else {
            res.render('auth/password', {
                title: 'Reset password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token,
            });
        }
    }
    catch (e) {
        console.log(e);
    }
}));
// router.post('/reset', (req: Request, res: Response) => {
//     try {
//         crypto.randomBytes(32, async (err, buffer) => {
//             if (err) {
//                 req.flash(
//                     'error',
//                     'Something went wrong, please try again a bit later'
//                 );
//                 return res.redirect('/auth/reset');
//             }
//             const token = buffer.toString('hex');
//             const candidate = await User.findOne({ email: req.body.email });
//             if (candidate) {
//                 candidate.resetToken = token;
//                 candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
//                 await candidate.save();
//                 await transporter.sendMail(resetEmail(candidate.email, token));
//                 res.redirect('/auth/login');
//             } else {
//                 req.flash('error', "Email doesn't exist");
//                 res.redirect('/auth/reset');
//             }
//         });
//     } catch (e) {
//         console.log(e);
//     }
// });
router.post('/password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() },
        });
        if (user) {
            user.password = yield bcryptjs_1.default.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            yield user.save();
            res.redirect('/auth/login');
        }
        else {
            req.flash('loginError', 'The token has expired');
            res.redirect('/auth/login');
        }
    }
    catch (e) {
        console.log(e);
    }
}));
exports.default = router;
