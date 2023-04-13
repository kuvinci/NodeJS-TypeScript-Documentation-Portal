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
function isOwner(bestPractice, req) {
    return bestPractice.userID.toString() === req.user._id.toString();
}
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bestPractices = yield BestPractices_1.default.find().populate('userID', 'email username name');
    res.render('bestPractices', {
        title: 'Best Practices (BP)',
        isBestPractices: true,
        bestPractices: bestPractices,
    });
}));
router.get('/:id/edit', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const bestPractice = yield BestPractices_1.default.findById(req.params.id);
    if (bestPractice) {
        res.render('bestPractice-edit', {
            title: bestPractice.title,
            bestPractice,
        });
    }
    else {
        res.status(404).render('404', {
            title: `Best Practice with id - ${req.params.id} not found`,
        });
    }
}));
router.post('/edit', auth_1.default, validators_1.bestPracticeValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    const { id } = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/best_practices/${id}/edit?allow=true`);
    }
    try {
        delete req.body.id;
        const bestPractice = yield BestPractices_1.default.findById(id);
        if (bestPractice) {
            if (!isOwner(bestPractice, req)) {
                return res.redirect('/best_practices');
            }
            Object.assign(bestPractice, req.body);
            yield bestPractice.save();
            res.redirect('/best_practices');
        }
        else {
            res.status(404).render('404', {
                title: `Best Practice with id - ${id} not found`,
            });
        }
    }
    catch (e) {
        console.log(e);
    }
}));
router.post('/delete', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield BestPractices_1.default.deleteOne({ _id: req.body.id });
    }
    catch (error) {
        console.log(error);
    }
    res.redirect('/best_practices');
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bestPractice = yield BestPractices_1.default.findById(req.params.id);
    if (bestPractice) {
        res.render('bestPractice', {
            title: bestPractice.title,
            bestPractice,
        });
    }
    else {
        res.status(404).render('404', {
            title: `Best Practice with id - ${req.params.id} not found`,
        });
    }
}));
exports.default = router;
