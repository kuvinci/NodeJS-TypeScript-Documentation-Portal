"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("../keys"));
module.exports = function (email, token) {
    return {
        to: email,
        from: keys_1.default.EMAIL_FROM,
        subject: 'Password reset',
        html: `
      <h1>Forgot your password?</h1>
      <p>To change your password click a link below:</p>
      <p><a href="${keys_1.default.BASE_URL}/auth/password/${token}">Reset password</a></p>
      <hr />
      <a href="${keys_1.default.BASE_URL}">${keys_1.default.BASE_URL}</a>
    `
    };
};
