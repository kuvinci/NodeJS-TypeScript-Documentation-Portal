"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
    bestPractices: {
        IDs: [
            {
                ID: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Best Practice',
                },
            },
        ],
    },
});
userSchema.methods.addBP = function (bestPractice) {
    const IDs = [...this.bestPractices.IDs];
    IDs.push(bestPractice.ID);
    this.bestPractices = { IDs };
    return this.save();
};
exports.default = (0, mongoose_1.model)('User', userSchema);
