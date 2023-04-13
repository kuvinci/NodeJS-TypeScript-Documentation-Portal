"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bestPracticeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    type_dahboard: {
        type: String,
    },
    type_wp: {
        type: String,
    },
    type_php: {
        type: String,
    },
    type_css: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
});
exports.default = (0, mongoose_1.model)('Best Practice', bestPracticeSchema);
