"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/login');
    }
    next();
}
exports.default = default_1;
