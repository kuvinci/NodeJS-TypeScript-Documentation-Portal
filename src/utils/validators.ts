import { body, oneOf, ValidationChain } from 'express-validator';
import User from '../models/User';

export const registerValidators: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Please input a valid email')
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject('Email already exists');
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),

    body('password', 'The password must be at least 6 characters long')
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim(),

    body('confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(
                    'The confirmation password does not match the password value. Please make sure the passwords match and try again'
                );
            }
            return true;
        })
        .trim(),

    body('name')
        .isLength({ min: 3 })
        .withMessage('The name must be at least 3 characters long')
        .trim(),
];

export const bestPracticeValidators: ValidationChain[] = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3 })
        .withMessage('The title must be at least 3 characters long')
        .trim(),

    // oneOf(
    //     [
    //         body('type_dahboard').custom((value) => value === 'on'),
    //         body('type_wp').custom((value) => value === 'on'),
    //         body('type_php').custom((value) => value === 'on'),
    //         body('type_css').custom((value) => value === 'on'),
    //     ],
    //     'At least one checkbox must be checked'
    // ),

    body('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),
];
