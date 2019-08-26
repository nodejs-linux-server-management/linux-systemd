"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Systemd_1 = require("./Systemd");
/**
 * @throws
 */
function systemd() {
    try {
        return new Systemd_1.Systemd();
    }
    catch (e) {
        throw e;
    }
}
exports.systemd = systemd;
function listNames(callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().listNames();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().listNames(undefined, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.listNames = listNames;
function list(callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().list();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().list(undefined, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.list = list;
function exists(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().exists(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().exists(service, undefined, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.exists = exists;
function basicInformations(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().basicInformations(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().basicInformations(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.basicInformations = basicInformations;
function detailedInformations(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().detailedInformations(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().detailedInformations(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.detailedInformations = detailedInformations;
function loadState(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().loadState(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().loadState(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.loadState = loadState;
function activeState(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().activeState(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().activeState(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.activeState = activeState;
function unitFileState(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().unitFileState(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().unitFileState(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.unitFileState = unitFileState;
function start(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().start(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().start(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.start = start;
function stop(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().stop(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().stop(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.stop = stop;
function restart(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().restart(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().restart(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.restart = restart;
function enable(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().enable(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().enable(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.enable = enable;
function disable(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().disable(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().disable(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.disable = disable;
function mask(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().mask(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().mask(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.mask = mask;
function unmask(service, callback) {
    if (typeof callback === 'undefined') {
        try {
            return systemd().unmask(service);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            systemd().unmask(service, callback);
        }
        catch (e) {
            //@ts-ignore
            callback(e);
        }
    }
}
exports.unmask = unmask;
