"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var linux_shell_command_1 = require("linux-shell-command");
var linux_package_manager_1 = require("linux-package-manager");
var Systemd = /** @class */ (function () {
    function Systemd() {
        this.installed = null;
        this.serviceNames = null;
        if (os_1.platform() !== 'linux') {
            throw Error("This module only runs on linux");
        }
    }
    Systemd.prototype.setup = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            linux_package_manager_1.isPackageInstalled('systemd').then(function (installed) {
                _this.installed = installed;
                resolve();
            }).catch(function (e) {
                reject(e);
            });
        });
    };
    Systemd.prototype.isInstalled = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.installed === null) {
                _this.setup().then(function () {
                    _this.isInstalled().then(function () { return resolve(); }).catch(function () { return reject(); });
                }).catch(function (e) {
                    reject(e);
                });
            }
            else if (_this.installed === true) {
                resolve();
            }
            else {
                reject(Error('Systemd isn\'t installed'));
            }
        });
    };
    Systemd.prototype.listNames = function (forceUpdate, callback) {
        var _this = this;
        if (forceUpdate === void 0) { forceUpdate = false; }
        var result;
        if (this.serviceNames === null || forceUpdate === true) {
            result = new Promise(function (resolve, reject) {
                _this.isInstalled().then(function () {
                    linux_shell_command_1.execute('systemctl list-unit-files -alt service --no-legend --no-pager | cut -d \' \' -f1').then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            _this.serviceNames = shellCommand.stdout.trim().split('\n').filter(function (name) { return !name.includes('@'); });
                            resolve(_this.serviceNames);
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
        else {
            result = Promise.resolve(this.serviceNames);
        }
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (services) {
                callback(null, services);
            }).catch(function (e) {
                //@ts-ignore;
                callback(e);
            });
        }
    };
    Systemd.prototype.list = function (forceUpdate, callback) {
        var _this = this;
        if (forceUpdate === void 0) { forceUpdate = false; }
        var result = new Promise(function (resolve, reject) {
            _this.listNames(forceUpdate).then(function (names) {
                var command = 'systemctl show \'!?!\' --no-pager -p Names,Description,LoadState,ActiveState,SubState,UnitFileState';
                command = command.replace(/'\!\?\!'/, new Array(names.length).fill("'!?!'").join(' '));
                linux_shell_command_1.execute(command, names).then(function (_a) {
                    var shellCommand = _a.shellCommand, success = _a.success;
                    if (success === true) {
                        var services = {};
                        var informations = shellCommand.stdout.trim().split('\n\n');
                        for (var i = 0; i < informations.length; i++) {
                            var service = informations[i].trim().split('\n');
                            var name_1 = service[0].split('=')[1];
                            services[name_1] = {
                                name: name_1,
                                description: service[1].split('=')[1],
                                loadState: service[2].split('=')[1],
                                activeState: service[3].split('=')[1],
                                subState: service[4].split('=')[1],
                                unitFileState: service[5].split('=')[1],
                            };
                        }
                        resolve(services);
                    }
                    else {
                        reject(shellCommand.error);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (services) {
                callback(null, services);
            }).catch(function (e) {
                //@ts-ignore
                callback(e);
            });
        }
    };
    Systemd.prototype.exists = function (service, forceUpdate, callback) {
        var _this = this;
        if (forceUpdate === void 0) { forceUpdate = false; }
        var result = new Promise(function (resolve, reject) {
            service = service.trim();
            if (!service.includes(' ')) {
                if (!service.includes('.service')) {
                    service = service + ".service";
                }
                _this.listNames(forceUpdate).then(function (names) {
                    resolve(names.includes(service));
                }).catch(function (e) {
                    reject(e);
                });
            }
            else {
                reject(Error('A service name cannot contain space'));
            }
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (exists) {
                callback(null, exists);
            }).catch(function (e) {
                setTimeout(function () {
                    //@ts-ignore
                    callback(e);
                });
            });
        }
    };
    Systemd.prototype.basicInformations = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.exists(service).then(function (exists) {
                if (exists === true) {
                    linux_shell_command_1.execute('systemctl show \'!?!\' --no-pager -p Names,Description,LoadState,ActiveState,SubState,UnitFileState', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            var service_1 = shellCommand.stdout.trim().split('\n');
                            resolve({
                                name: service_1[0].split('=')[1],
                                description: service_1[1].split('=')[1],
                                loadState: service_1[2].split('=')[1],
                                activeState: service_1[3].split('=')[1],
                                subState: service_1[4].split('=')[1],
                                unitFileState: service_1[5].split('=')[1]
                            });
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("The service \"" + service + "\" doesn't exists"));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (informations) {
                callback(null, informations);
            }).catch(function (e) {
                //@ts-ignore
                callback(e);
            });
        }
    };
    Systemd.prototype.detailedInformations = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.exists(service).then(function (exists) {
                if (exists === true) {
                    linux_shell_command_1.execute('systemctl show \'!?!\' --no-pager', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            var buf = shellCommand.stdout.trim().split('\n');
                            var informations = {};
                            for (var i = 0; i < buf.length; i++) {
                                var information = buf[i].split('=');
                                informations[information[0]] = information[1];
                            }
                            resolve(informations);
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("The service \"" + service + "\" doesn't exists"));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (informations) {
                callback(null, informations);
            }).catch(function (e) {
                //@ts-ignore
                callback(e);
            });
        }
    };
    Systemd.prototype.loadState = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.exists(service).then(function (exists) {
                if (exists === true) {
                    linux_shell_command_1.execute('systemctl show \'!?!\' --no-pager -p LoadState --value', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve(shellCommand.stdout.trim());
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("The service \"" + service + "\" doesn't exists"));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (loadState) {
                callback(null, loadState);
            }).catch(function (e) {
                //@ts-ignore
                callback(e);
            });
        }
    };
    Systemd.prototype.activeState = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.exists(service).then(function (exists) {
                if (exists === true) {
                    linux_shell_command_1.execute('systemctl show \'!?!\' --no-pager -p ActiveState --value', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve(shellCommand.stdout.trim());
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("The service \"" + service + "\" doesn't exists"));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (activeState) {
                callback(null, activeState);
            }).catch(function (e) {
                //@ts-ignore
                callback(e);
            });
        }
    };
    Systemd.prototype.unitFileState = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.exists(service).then(function (exists) {
                if (exists === true) {
                    linux_shell_command_1.execute('systemctl show \'!?!\' --no-pager -p UnitFileState --value', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve(shellCommand.stdout.trim());
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("The service \"" + service + "\" doesn't exists"));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function (unitFileState) {
                callback(null, unitFileState);
            }).catch(function (e) {
                //@ts-ignore
                callback(e);
            });
        }
    };
    Systemd.prototype.start = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.activeState(service).then(function (activeState) {
                if (activeState === 'inactive') {
                    linux_shell_command_1.execute('sudo systemctl start \'!?!\'', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("To be started the service should be inactive but his current active state is " + activeState));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function () {
                callback(null);
            }).catch(function (e) {
                callback(e);
            });
        }
    };
    Systemd.prototype.stop = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.activeState(service).then(function (activeState) {
                if (activeState === 'active') {
                    linux_shell_command_1.execute('sudo systemctl stop \'!?!\'', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("To be stopped the service should be active but his current active state is " + activeState));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function () {
                callback(null);
            }).catch(function (e) {
                callback(e);
            });
        }
    };
    Systemd.prototype.restart = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.activeState(service).then(function (activeState) {
                if (activeState === 'active') {
                    linux_shell_command_1.execute('sudo systemctl restart \'!?!\'', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("To be restarted the service should be active but his current active state is " + activeState));
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function () {
                callback(null);
            }).catch(function (e) {
                callback(e);
            });
        }
    };
    Systemd.prototype.enable = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.unitFileState(service).then(function (unitFileState) {
                if (unitFileState === 'masked') {
                    reject(Error('The service is currently masked and cannot be enabled'));
                }
                else if (unitFileState !== 'enabled') {
                    linux_shell_command_1.execute('sudo systemctl enable \'!?!\'', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    // reject(Error('The service is already enabled'));
                    resolve();
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function () {
                callback(null);
            }).catch(function (e) {
                callback(e);
            });
        }
    };
    Systemd.prototype.disable = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.unitFileState(service).then(function (unitFileState) {
                if (unitFileState === 'masked') {
                    reject(Error('The service is currently masked and cannot be disabled'));
                }
                else if (unitFileState !== 'disabled') {
                    linux_shell_command_1.execute('sudo systemctl disable \'!?!\'', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    // reject(Error('The service is already disabled'));
                    resolve();
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function () {
                callback(null);
            }).catch(function (e) {
                callback(e);
            });
        }
    };
    Systemd.prototype.mask = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.unitFileState(service).then(function (unitFileState) {
                if (unitFileState !== 'masked') {
                    linux_shell_command_1.execute('sudo systemctl mask \'!?!\'', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    // reject(Error('The service is already masked'));
                    resolve();
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function () {
                callback(null);
            }).catch(function (e) {
                callback(e);
            });
        }
    };
    Systemd.prototype.unmask = function (service, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.unitFileState(service).then(function (unitFileState) {
                if (unitFileState === 'masked') {
                    linux_shell_command_1.execute('sudo systemctl unmask \'!?!\'', [service]).then(function (_a) {
                        var shellCommand = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    // reject(Error('The service isn\'t masked'));
                    resolve();
                }
            }).catch(function (e) {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(function () {
                callback(null);
            }).catch(function (e) {
                callback(e);
            });
        }
    };
    return Systemd;
}());
exports.Systemd = Systemd;
