"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    res.status(404).render('404', {
        title: 'Page not found',
    });
}
exports.default = default_1;
;
