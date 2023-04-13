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
exports.bestPracticeValidators = exports.registerValidators = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
exports.registerValidators = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please input a valid email')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ email: value });
            if (user) {
                return Promise.reject('Email already exists');
            }
        }
        catch (e) {
            console.log(e);
        }
    }))
        .normalizeEmail(),
    (0, express_validator_1.body)('password', 'The password must be at least 6 characters long')
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim(),
    (0, express_validator_1.body)('confirm')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The confirmation password does not match the password value. Please make sure the passwords match and try again');
        }
        return true;
    })
        .trim(),
    (0, express_validator_1.body)('name')
        .isLength({ min: 3 })
        .withMessage('The name must be at least 3 characters long')
        .trim(),
];
exports.bestPracticeValidators = [
    (0, express_validator_1.body)('title')
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
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),
];
