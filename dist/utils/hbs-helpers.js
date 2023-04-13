"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    ifeq(a, b, options) {
        if (a == b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
};
