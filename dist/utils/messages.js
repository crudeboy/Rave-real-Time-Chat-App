"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLocationMessage = exports.generateMessage = void 0;
const generateMessage = (username, message) => {
    return {
        username: username,
        text: message,
        createdAt: new Date().getTime()
    };
};
exports.generateMessage = generateMessage;
const generateLocationMessage = (username, message) => {
    return {
        username: username,
        text: message,
        createdAt: new Date().getTime()
    };
};
exports.generateLocationMessage = generateLocationMessage;
