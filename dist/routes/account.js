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
const BestPractices_1 = __importDefault(require("../models/BestPractices"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bestPractices = yield BestPractices_1.default.find()
        .populate('userID', 'email username name');
    res.render('account', {
        title: 'Profile page TEST',
        isAccount: true,
        bestPractices: bestPractices,
        user: {
            email: req.user.email,
            username: req.user.username,
            name: req.user.name,
        }
    });
}));
router.post('/edit', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user._id;
        const user = {
            email: req.body.email,
            username: req.body.username,
            name: req.body.name,
        };
        yield User_1.default.findByIdAndUpdate(id, user);
        res.redirect('/account');
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
