"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("../keys"));
function default_1(email) {
    return {
        to: email,
        from: keys_1.default.EMAIL_FROM,
        subject: 'Account created',
        html: `
      <h1>Your account successfully created</h1>
      <p>Email - ${email}</p>
      <hr />
      <a href="${keys_1.default.BASE_URL}">Website</a>
    `
    };
}
exports.default = default_1;
