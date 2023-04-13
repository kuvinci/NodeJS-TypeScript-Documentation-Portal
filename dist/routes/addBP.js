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
const express_validator_1 = require("express-validator");
const BestPractices_1 = __importDefault(require("../models/BestPractices"));
const auth_1 = __importDefault(require("../middleware/auth"));
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.get('/', auth_1.default, (req, res) => {
    res.render('addBP', {
        title: 'Add Best Practice',
        isBP: true,
    });
});
router.post('/', auth_1.default, validators_1.bestPracticeValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('addBP', {
            title: 'Add Best Practice',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                type_dahboard: req.body.type_dahboard,
                type_wp: req.body.type_wp,
                type_php: req.body.type_php,
                type_css: req.body.type_css,
                content: req.body.content,
                userID: req.user._id,
            },
        });
    }
    const bestPractice = new BestPractices_1.default({
        title: req.body.title,
        type_dahboard: req.body.type_dahboard,
        type_wp: req.body.type_wp,
        type_php: req.body.type_php,
        type_css: req.body.type_css,
        content: req.body.content,
        userID: req.user._id,
    });
    try {
        yield req.user.addBP(bestPractice);
        yield bestPractice.save();
        res.redirect('/best_practices');
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
