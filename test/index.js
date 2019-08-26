/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
var platform = require('os').platform;
var index = require('../dist/index');

describe('#index (Promises)', function () {
	this.timeout(10000);
	if (platform() === 'linux') {
		it('#listNames', (done) => {
			index.listNames().then((names) => {
				if (Array.isArray(names)) {
					if (names.every((name) => {
						return typeof name === 'string';
					})) {
						index.listNames().then((names) => {
							if (Array.isArray(names)) {
								if (names.every((name) => {
									return typeof name === 'string';
								})) {
									index.listNames().then((names) => {
										if (Array.isArray(names)) {
											if (names.every((name) => {
												return typeof name === 'string';
											})) {
												done();
											} else {
												done(Error('Third force not cached: Should return an array of string but at least one of the element isn\'t a string'));
											}
										} else {
											done(Error(`Third force not cached: Should return an array of string but returned: ${typeof names}`));
										}
									}).catch((e) => {
										done(Error(`Shouldn't fail\n${e}`));
									});
								} else {
									done(Error('Second cached: Should return an array of string but at least one of the element isn\'t a string'));
								}
							} else {
								done(Error(`Second cached: Should return an array of string but returned: ${typeof names}`));
							}
						}).catch((e) => {
							done(Error(`Shouldn't fail\n${e}`));
						});
					} else {
						done(Error('First not cached: Should return an array of string but at least one of the element isn\'t a string'));
					}
				} else {
					done(Error(`First not cached: Should return an array of string but returned: ${typeof names}`));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#list', (done) => {
			index.list().then(() => {
				index.list().then(() => {
					done();
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#exists', (done) => {
			index.exists('accounts-daemon').then((exists) => {
				if (exists === true) {
					index.exists('fgfbhdvdfvhfdj').then((exists) => {
						if (exists === false) {
							index.exists('test space').then(() => {
								done(Error('Should fail because a service name cannot contain space'));
							}).catch(() => {
								index.exists('accounts-daemon').then((exists) => {
									if (exists === true) {
										index.exists('fgfbhdvdfvhfdj').then((exists) => {
											if (exists === false) {
												index.exists('test space').then(() => {
													done(Error('Should fail because a service name cannot contain space'));
												}).catch(() => {
													done();
												});
											} else {
												done('The service "fgfbhdvdfvhfdj" shouldn\'t exist');
											}
										}).catch((e) => {
											done(Error(`Shouldn't fail\n${e}`));
										});
									} else {
										done(Error('The service "accounts-daemon" should exist'));
									}
								}).catch((e) => {
									done(Error(`Shouldn't fail\n${e}`));
								});
							});
						} else {
							done('The service "fgfbhdvdfvhfdj" shouldn\'t exist');
						}
					}).catch((e) => {
						done(Error(`Shouldn't fail\n${e}`));
					});
				} else {
					done(Error('The service "accounts-daemon" should exist'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#basicInformations', (done) => {
			index.basicInformations('accounts-daemon').then((basicInformations) => {
				if (basicInformations.hasOwnProperty('name') &&
					basicInformations.hasOwnProperty('description') &&
					basicInformations.hasOwnProperty('loadState') &&
					basicInformations.hasOwnProperty('activeState') &&
					basicInformations.hasOwnProperty('subState') &&
					basicInformations.hasOwnProperty('unitFileState')) {
					done();
				} else {
					done(Error('One or more property(ies) is/are missing'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#detailedInformations', (done) => {
			index.detailedInformations('accounts-daemon').then((detailedInformations) => {
				if (checkDetailedInformations(detailedInformations)) {
					done();
				} else {
					done(Error('One or more property(ies) is/are missing'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#loadState', (done) => {
			index.loadState('accounts-daemon').then((loadState) => {
				if (loadState === 'bad-setting' || loadState === 'error' || loadState === 'loaded' || loadState === 'masked' || loadState === 'merged' || loadState === 'not-found' || loadState === 'stub') {
					done();
				} else {
					done(Error('The load state returned is not expected'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#activeState', (done) => {
			index.activeState('accounts-daemon').then((activeState) => {
				if (activeState === 'activating' || activeState === 'active' || activeState === 'deactivating' || activeState === 'failed' || activeState === 'inactive' || activeState === 'reloading') {
					done();
				} else {
					done(Error('The active state returned is not expected'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#unitFileState', (done) => {
			index.unitFileState('accounts-daemon').then((unitFileState) => {
				if (unitFileState === 'disabled' || unitFileState === 'enabled' || unitFileState === 'enabled-runtime' || unitFileState === 'indirect' || unitFileState === 'masked' || unitFileState === 'static') {
					done();
				} else {
					done(Error('The unit file state returned is not expected'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#start', (done) => {
			var service = 'sshd';
			index.start(service).then(() => {
				done();
			}).catch((e) => {
				index.exists(service).then((exists) => {
					if (exists === false) {
						console.info(`To run this test you should have the service ${service}`).
							done();
					} else {
						done(Error(`Shouldn't fail\n${e}`));
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			});
		});
		it('#restart', (done) => {
			var service = 'sshd';
			index.restart(service).then(() => {
				done();
			}).catch((e) => {
				index.exists(service).then((exists) => {
					if (exists === false) {
						console.info(`To run this test you should have the service ${service}`).
							done();
					} else {
						done(Error(`Shouldn't fail\n${e}`));
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			});
		});
		it('#stop', (done) => {
			var service = 'sshd';
			index.stop(service).then(() => {
				done();
			}).catch((e) => {
				index.exists(service).then((exists) => {
					if (exists === false) {
						console.info(`To run this test you should have the service ${service}`).
							done();
					} else {
						done(Error(`Shouldn't fail\n${e}`));
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			});
		});
		it('#enable', (done) => {
			var service = 'sshd';
			index.enable(service).then(() => {
				done();
			}).catch((e) => {
				index.exists(service).then((exists) => {
					if (exists === false) {
						console.info(`To run this test you should have the service ${service}`).
							done();
					} else {
						done(Error(`Shouldn't fail\n${e}`));
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			});
		});
		it('#disable', (done) => {
			var service = 'sshd';
			index.disable(service).then(() => {
				done();
			}).catch((e) => {
				index.exists(service).then((exists) => {
					if (exists === false) {
						console.info(`To run this test you should have the service ${service}`).
							done();
					} else {
						done(Error(`Shouldn't fail\n${e}`));
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			});
		});
		it('#mask', (done) => {
			var service = 'sshd';
			index.mask(service).then(() => {
				done();
			}).catch((e) => {
				index.exists(service).then((exists) => {
					if (exists === false) {
						console.info(`To run this test you should have the service ${service}`).
							done();
					} else {
						done(Error(`Shouldn't fail\n${e}`));
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			});
		});
		it('#unmask', (done) => {
			var service = 'sshd';
			index.unmask(service).then(() => {
				done();
			}).catch((e) => {
				index.exists(service).then((exists) => {
					if (exists === false) {
						console.info(`To run this test you should have the service ${service}`).
							done();
					} else {
						done(Error(`Shouldn't fail\n${e}`));
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			});
		});
	} else {
		it('#Bad platform', () => {
			assert.throws(() => new Systemd(), 'Shouldn\'t work on this platform');
		});
	}
});

describe('#index (Callbacks)', function () {
	this.timeout(10000);
	if (platform() === 'linux') {
		it('#listNames', (done) => {
			index.listNames((error, names) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (Array.isArray(names)) {
						if (names.every((name) => {
							return typeof name === 'string';
						})) {
							index.listNames((error, names) => {
								if (error) {
									done(Error(`Shouldn't fail\n${error}`));
								} else {
									if (Array.isArray(names)) {
										if (names.every((name) => {
											return typeof name === 'string';
										})) {
											index.listNames((error, names) => {
												if (error) {
													done(Error(`Shouldn't fail\n${error}`));
												} else {
													if (Array.isArray(names)) {
														if (names.every((name) => {
															return typeof name === 'string';
														})) {
															done();
														} else {
															done(Error('Third force not cached: Should return an array of string but at least one of the element isn\'t a string'));
														}
													} else {
														done(Error(`Third force not cached: Should return an array of string but returned: ${typeof names}`));
													}
												}
											});
										} else {
											done(Error('Second cached: Should return an array of string but at least one of the element isn\'t a string'));
										}
									} else {
										done(Error(`Second cached: Should return an array of string but returned: ${typeof names}`));
									}
								}
							});
						} else {
							done(Error('First not cached: Should return an array of string but at least one of the element isn\'t a string'));
						}
					} else {
						done(Error(`First not cached: Should return an array of string but returned: ${typeof names}`));
					}
				}
			});
		});
		it('#list', (done) => {
			index.list((error) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					index.list((error) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							done();
						}
					});
				}
			});
		});
		it('#exists', (done) => {
			index.exists('accounts-daemon', (error, exists) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (exists === true) {
						index.exists('fgfbhdvdfvhfdj', (error, exists) => {
							if (error) {
								done(Error(`Shouldn't fail\n${error}`));
							} else {
								if (exists === false) {
									index.exists('test space', (error) => {
										if (error) {
											index.exists('accounts-daemon', (error, exists) => {
												if (error) {
													done(Error(`Shouldn't fail\n${error}`));
												} else {
													if (exists === true) {
														index.exists('fgfbhdvdfvhfdj', (error, exists) => {
															if (error) {
																done(Error(`Shouldn't fail\n${error}`));
															} else {
																if (exists === false) {
																	index.exists('test space', (error) => {
																		if (error) {
																			done();
																		} else {
																			done(Error('Should fail because a service name cannot contain space'));
																		}
																	});
																} else {
																	done(Error('The service "fgfbhdvdfvhfdj" shouldn\'t exist'));
																}
															}
														});
													} else {
														done(Error('The service "accounts-daemon" should exist'));
													}
												}
											});
										} else {
											done(Error('Should fail because a service name cannot contain space'));
										}
									});
								} else {
									done(Error('The service "fgfbhdvdfvhfdj" shouldn\'t exist'));
								}
							}
						});
					} else {
						done(Error('The service "accounts-daemon" should exist'));
					}
				}
			});
		});
		it('#basicInformations', (done) => {
			index.basicInformations('accounts-daemon', (error, basicInformations) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (basicInformations.hasOwnProperty('name') &&
						basicInformations.hasOwnProperty('description') &&
						basicInformations.hasOwnProperty('loadState') &&
						basicInformations.hasOwnProperty('activeState') &&
						basicInformations.hasOwnProperty('subState') &&
						basicInformations.hasOwnProperty('unitFileState')) {
						done();
					} else {
						done(Error('One or more property(ies) is/are missing'));
					}
				}
			});
		});
		it('#detailedInformations', (done) => {
			index.detailedInformations('accounts-daemon', (error, detailedInformations) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (checkDetailedInformations(detailedInformations)) {
						done();
					} else {
						done(Error('One or more property(ies) is/are missing'));
					}
				}
			});
		});
		it('#loadState', (done) => {
			index.loadState('accounts-daemon', (error, loadState) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (loadState === 'bad-setting' || loadState === 'error' || loadState === 'loaded' || loadState === 'masked' || loadState === 'merged' || loadState === 'not-found' || loadState === 'stub') {
						done();
					} else {
						done(Error('The load state returned is not expected'));
					}
				}
			});
		});
		it('#activeState', (done) => {
			index.activeState('accounts-daemon', (error, activeState) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (activeState === 'activating' || activeState === 'active' || activeState === 'deactivating' || activeState === 'failed' || activeState === 'inactive' || activeState === 'reloading') {
						done();
					} else {
						done(Error('The active state returned is not expected'));
					}
				}
			});
		});
		it('#unitFileState', (done) => {
			index.unitFileState('accounts-daemon', (error, unitFileState) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (unitFileState === 'disabled' || unitFileState === 'enabled' || unitFileState === 'enabled-runtime' || unitFileState === 'indirect' || unitFileState === 'masked' || unitFileState === 'static') {
						done();
					} else {
						done(Error('The unit file state returned is not expected'));
					}
				}
			});
		});
		it('#start', (done) => {
			var service = 'sshd';
			index.start(service, (error) => {
				if (error) {
					index.exists(service, (error, exists) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists === false) {
								console.info(`To run this test you should have the service ${service}`).
									done();
							} else {
								done(Error(`Shouldn't fail\n${error}`));
							}
						}
					});
				} else {
					done();
				}
			});
		});
		it('#restart', (done) => {
			var service = 'sshd';
			index.restart(service, (error) => {
				if (error) {
					index.exists(service, (error, exists) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists === false) {
								console.info(`To run this test you should have the service ${service}`).
									done();
							} else {
								done(Error(`Shouldn't fail\n${error}`));
							}
						}
					});
				} else {
					done();
				}
			});
		});
		it('#stop', (done) => {
			var service = 'sshd';
			index.stop(service, (error) => {
				if (error) {
					index.exists(service, (error, exists) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists === false) {
								console.info(`To run this test you should have the service ${service}`).
									done();
							} else {
								done(Error(`Shouldn't fail\n${error}`));
							}
						}
					});
				} else {
					done();
				}
			});
		});
		it('#enable', (done) => {
			var service = 'sshd';
			index.enable(service, (error) => {
				if (error) {
					index.exists(service, (error, exists) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists === false) {
								console.info(`To run this test you should have the service ${service}`).
									done();
							} else {
								done(Error(`Shouldn't fail\n${error}`));
							}
						}
					});
				} else {
					done();
				}
			});
		});
		it('#disable', (done) => {
			var service = 'sshd';
			index.disable(service, (error) => {
				if (error) {
					index.exists(service, (error, exists) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists === false) {
								console.info(`To run this test you should have the service ${service}`).
									done();
							} else {
								done(Error(`Shouldn't fail\n${error}`));
							}
						}
					});
				} else {
					done();
				}
			});
		});
		it('#mask', (done) => {
			var service = 'sshd';
			index.mask(service, (error) => {
				if (error) {
					index.exists(service, (error, exists) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists === false) {
								console.info(`To run this test you should have the service ${service}`).
									done();
							} else {
								done(Error(`Shouldn't fail\n${error}`));
							}
						}
					});
				} else {
					done();
				}
			});
		});
		it('#unmask', (done) => {
			var service = 'sshd';
			index.unmask(service, (error) => {
				if (error) {
					index.exists(service, (error, exists) => {
						if (error) {
							done(Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists === false) {
								console.info(`To run this test you should have the service ${service}`).
									done();
							} else {
								done(Error(`Shouldn't fail\n${error}`));
							}
						}
					});
				} else {
					done();
				}
			});
		});
	} else {
		it('#Bad platform', () => {
			assert.throws(() => new Systemd(), 'Shouldn\'t work on this platform');
		});
	}
});

function checkDetailedInformations(detailedInformations) {
	return detailedInformations.hasOwnProperty('Type') &&
		detailedInformations.hasOwnProperty('Restart') &&
		detailedInformations.hasOwnProperty('NotifyAccess') &&
		detailedInformations.hasOwnProperty('RestartUSec') &&
		detailedInformations.hasOwnProperty('TimeoutStartUSec') &&
		detailedInformations.hasOwnProperty('TimeoutStopUSec') &&
		detailedInformations.hasOwnProperty('RuntimeMaxUSec') &&
		detailedInformations.hasOwnProperty('WatchdogUSec') &&
		detailedInformations.hasOwnProperty('WatchdogTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('RootDirectoryStartOnly') &&
		detailedInformations.hasOwnProperty('RemainAfterExit') &&
		detailedInformations.hasOwnProperty('GuessMainPID') &&
		detailedInformations.hasOwnProperty('MainPID') &&
		detailedInformations.hasOwnProperty('ControlPID') &&
		detailedInformations.hasOwnProperty('FileDescriptorStoreMax') &&
		detailedInformations.hasOwnProperty('NFileDescriptorStore') &&
		detailedInformations.hasOwnProperty('StatusErrno') &&
		detailedInformations.hasOwnProperty('Result') &&
		detailedInformations.hasOwnProperty('ReloadResult') &&
		detailedInformations.hasOwnProperty('UID') &&
		detailedInformations.hasOwnProperty('GID') &&
		detailedInformations.hasOwnProperty('NRestarts') &&
		detailedInformations.hasOwnProperty('ExecMainStartTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('ExecMainExitTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('ExecMainPID') &&
		detailedInformations.hasOwnProperty('ExecMainCode') &&
		detailedInformations.hasOwnProperty('ExecMainStatus') &&
		detailedInformations.hasOwnProperty('ExecStart') &&
		detailedInformations.hasOwnProperty('Slice') &&
		detailedInformations.hasOwnProperty('MemoryCurrent') &&
		detailedInformations.hasOwnProperty('CPUUsageNSec') &&
		detailedInformations.hasOwnProperty('TasksCurrent') &&
		detailedInformations.hasOwnProperty('IPIngressBytes') &&
		detailedInformations.hasOwnProperty('IPIngressPackets') &&
		detailedInformations.hasOwnProperty('IPEgressBytes') &&
		detailedInformations.hasOwnProperty('IPEgressPackets') &&
		detailedInformations.hasOwnProperty('Delegate') &&
		detailedInformations.hasOwnProperty('CPUAccounting') &&
		detailedInformations.hasOwnProperty('CPUWeight') &&
		detailedInformations.hasOwnProperty('StartupCPUWeight') &&
		detailedInformations.hasOwnProperty('CPUShares') &&
		detailedInformations.hasOwnProperty('StartupCPUShares') &&
		detailedInformations.hasOwnProperty('CPUQuotaPerSecUSec') &&
		detailedInformations.hasOwnProperty('CPUQuotaPeriodUSec') &&
		detailedInformations.hasOwnProperty('IOAccounting') &&
		detailedInformations.hasOwnProperty('IOWeight') &&
		detailedInformations.hasOwnProperty('StartupIOWeight') &&
		detailedInformations.hasOwnProperty('BlockIOAccounting') &&
		detailedInformations.hasOwnProperty('BlockIOWeight') &&
		detailedInformations.hasOwnProperty('StartupBlockIOWeight') &&
		detailedInformations.hasOwnProperty('MemoryAccounting') &&
		detailedInformations.hasOwnProperty('MemoryMin') &&
		detailedInformations.hasOwnProperty('MemoryLow') &&
		detailedInformations.hasOwnProperty('MemoryHigh') &&
		detailedInformations.hasOwnProperty('MemoryMax') &&
		detailedInformations.hasOwnProperty('MemorySwapMax') &&
		detailedInformations.hasOwnProperty('MemoryLimit') &&
		detailedInformations.hasOwnProperty('DevicePolicy') &&
		detailedInformations.hasOwnProperty('TasksAccounting') &&
		detailedInformations.hasOwnProperty('TasksMax') &&
		detailedInformations.hasOwnProperty('IPAccounting') &&
		detailedInformations.hasOwnProperty('UMask') &&
		detailedInformations.hasOwnProperty('LimitCPU') &&
		detailedInformations.hasOwnProperty('LimitCPUSoft') &&
		detailedInformations.hasOwnProperty('LimitFSIZE') &&
		detailedInformations.hasOwnProperty('LimitFSIZESoft') &&
		detailedInformations.hasOwnProperty('LimitDATA') &&
		detailedInformations.hasOwnProperty('LimitDATASoft') &&
		detailedInformations.hasOwnProperty('LimitSTACK') &&
		detailedInformations.hasOwnProperty('LimitSTACKSoft') &&
		detailedInformations.hasOwnProperty('LimitCORE') &&
		detailedInformations.hasOwnProperty('LimitCORESoft') &&
		detailedInformations.hasOwnProperty('LimitRSS') &&
		detailedInformations.hasOwnProperty('LimitRSSSoft') &&
		detailedInformations.hasOwnProperty('LimitNOFILE') &&
		detailedInformations.hasOwnProperty('LimitNOFILESoft') &&
		detailedInformations.hasOwnProperty('LimitAS') &&
		detailedInformations.hasOwnProperty('LimitASSoft') &&
		detailedInformations.hasOwnProperty('LimitNPROC') &&
		detailedInformations.hasOwnProperty('LimitNPROCSoft') &&
		detailedInformations.hasOwnProperty('LimitMEMLOCK') &&
		detailedInformations.hasOwnProperty('LimitMEMLOCKSoft') &&
		detailedInformations.hasOwnProperty('LimitLOCKS') &&
		detailedInformations.hasOwnProperty('LimitLOCKSSoft') &&
		detailedInformations.hasOwnProperty('LimitSIGPENDING') &&
		detailedInformations.hasOwnProperty('LimitSIGPENDINGSoft') &&
		detailedInformations.hasOwnProperty('LimitMSGQUEUE') &&
		detailedInformations.hasOwnProperty('LimitMSGQUEUESoft') &&
		detailedInformations.hasOwnProperty('LimitNICE') &&
		detailedInformations.hasOwnProperty('LimitNICESoft') &&
		detailedInformations.hasOwnProperty('LimitRTPRIO') &&
		detailedInformations.hasOwnProperty('LimitRTPRIOSoft') &&
		detailedInformations.hasOwnProperty('LimitRTTIME') &&
		detailedInformations.hasOwnProperty('LimitRTTIMESoft') &&
		detailedInformations.hasOwnProperty('OOMScoreAdjust') &&
		detailedInformations.hasOwnProperty('Nice') &&
		detailedInformations.hasOwnProperty('IOSchedulingClass') &&
		detailedInformations.hasOwnProperty('IOSchedulingPriority') &&
		detailedInformations.hasOwnProperty('CPUSchedulingPolicy') &&
		detailedInformations.hasOwnProperty('CPUSchedulingPriority') &&
		detailedInformations.hasOwnProperty('TimerSlackNSec') &&
		detailedInformations.hasOwnProperty('CPUSchedulingResetOnFork') &&
		detailedInformations.hasOwnProperty('NonBlocking') &&
		detailedInformations.hasOwnProperty('StandardInput') &&
		detailedInformations.hasOwnProperty('StandardInputData') &&
		detailedInformations.hasOwnProperty('StandardOutput') &&
		detailedInformations.hasOwnProperty('StandardError') &&
		detailedInformations.hasOwnProperty('TTYReset') &&
		detailedInformations.hasOwnProperty('TTYVHangup') &&
		detailedInformations.hasOwnProperty('TTYVTDisallocate') &&
		detailedInformations.hasOwnProperty('SyslogPriority') &&
		detailedInformations.hasOwnProperty('SyslogLevelPrefix') &&
		detailedInformations.hasOwnProperty('SyslogLevel') &&
		detailedInformations.hasOwnProperty('SyslogFacility') &&
		detailedInformations.hasOwnProperty('LogLevelMax') &&
		detailedInformations.hasOwnProperty('LogRateLimitIntervalUSec') &&
		detailedInformations.hasOwnProperty('LogRateLimitBurst') &&
		detailedInformations.hasOwnProperty('SecureBits') &&
		detailedInformations.hasOwnProperty('CapabilityBoundingSet') &&
		detailedInformations.hasOwnProperty('AmbientCapabilities') &&
		detailedInformations.hasOwnProperty('DynamicUser') &&
		detailedInformations.hasOwnProperty('RemoveIPC') &&
		detailedInformations.hasOwnProperty('MountFlags') &&
		detailedInformations.hasOwnProperty('PrivateTmp') &&
		detailedInformations.hasOwnProperty('PrivateDevices') &&
		detailedInformations.hasOwnProperty('ProtectKernelTunables') &&
		detailedInformations.hasOwnProperty('ProtectKernelModules') &&
		detailedInformations.hasOwnProperty('ProtectControlGroups') &&
		detailedInformations.hasOwnProperty('PrivateNetwork') &&
		detailedInformations.hasOwnProperty('PrivateUsers') &&
		detailedInformations.hasOwnProperty('PrivateMounts') &&
		detailedInformations.hasOwnProperty('ProtectHome') &&
		detailedInformations.hasOwnProperty('ProtectSystem') &&
		detailedInformations.hasOwnProperty('SameProcessGroup') &&
		detailedInformations.hasOwnProperty('UtmpMode') &&
		detailedInformations.hasOwnProperty('IgnoreSIGPIPE') &&
		detailedInformations.hasOwnProperty('NoNewPrivileges') &&
		detailedInformations.hasOwnProperty('SystemCallErrorNumber') &&
		detailedInformations.hasOwnProperty('LockPersonality') &&
		detailedInformations.hasOwnProperty('RuntimeDirectoryPreserve') &&
		detailedInformations.hasOwnProperty('RuntimeDirectoryMode') &&
		detailedInformations.hasOwnProperty('StateDirectoryMode') &&
		detailedInformations.hasOwnProperty('CacheDirectoryMode') &&
		detailedInformations.hasOwnProperty('LogsDirectoryMode') &&
		detailedInformations.hasOwnProperty('ConfigurationDirectoryMode') &&
		detailedInformations.hasOwnProperty('MemoryDenyWriteExecute') &&
		detailedInformations.hasOwnProperty('RestrictRealtime') &&
		detailedInformations.hasOwnProperty('RestrictSUIDSGID') &&
		detailedInformations.hasOwnProperty('RestrictNamespaces') &&
		detailedInformations.hasOwnProperty('MountAPIVFS') &&
		detailedInformations.hasOwnProperty('KeyringMode') &&
		detailedInformations.hasOwnProperty('ProtectHostname') &&
		detailedInformations.hasOwnProperty('KillMode') &&
		detailedInformations.hasOwnProperty('KillSignal') &&
		detailedInformations.hasOwnProperty('FinalKillSignal') &&
		detailedInformations.hasOwnProperty('SendSIGKILL') &&
		detailedInformations.hasOwnProperty('SendSIGHUP') &&
		detailedInformations.hasOwnProperty('WatchdogSignal') &&
		detailedInformations.hasOwnProperty('Id') &&
		detailedInformations.hasOwnProperty('Names') &&
		detailedInformations.hasOwnProperty('Requires') &&
		detailedInformations.hasOwnProperty('Conflicts') &&
		detailedInformations.hasOwnProperty('Before') &&
		detailedInformations.hasOwnProperty('After') &&
		detailedInformations.hasOwnProperty('Description') &&
		detailedInformations.hasOwnProperty('LoadState') &&
		detailedInformations.hasOwnProperty('ActiveState') &&
		detailedInformations.hasOwnProperty('SubState') &&
		detailedInformations.hasOwnProperty('FragmentPath') &&
		detailedInformations.hasOwnProperty('UnitFileState') &&
		detailedInformations.hasOwnProperty('UnitFilePreset') &&
		detailedInformations.hasOwnProperty('StateChangeTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('InactiveExitTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('ActiveEnterTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('ActiveExitTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('InactiveEnterTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('CanStart') &&
		detailedInformations.hasOwnProperty('CanStop') &&
		detailedInformations.hasOwnProperty('CanReload') &&
		detailedInformations.hasOwnProperty('CanIsolate') &&
		detailedInformations.hasOwnProperty('StopWhenUnneeded') &&
		detailedInformations.hasOwnProperty('RefuseManualStart') &&
		detailedInformations.hasOwnProperty('RefuseManualStop') &&
		detailedInformations.hasOwnProperty('AllowIsolate') &&
		detailedInformations.hasOwnProperty('DefaultDependencies') &&
		detailedInformations.hasOwnProperty('OnFailureJobMode') &&
		detailedInformations.hasOwnProperty('IgnoreOnIsolate') &&
		detailedInformations.hasOwnProperty('NeedDaemonReload') &&
		detailedInformations.hasOwnProperty('JobTimeoutUSec') &&
		detailedInformations.hasOwnProperty('JobRunningTimeoutUSec') &&
		detailedInformations.hasOwnProperty('JobTimeoutAction') &&
		detailedInformations.hasOwnProperty('ConditionResult') &&
		detailedInformations.hasOwnProperty('AssertResult') &&
		detailedInformations.hasOwnProperty('ConditionTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('AssertTimestampMonotonic') &&
		detailedInformations.hasOwnProperty('Transient') &&
		detailedInformations.hasOwnProperty('Perpetual') &&
		detailedInformations.hasOwnProperty('StartLimitIntervalUSec') &&
		detailedInformations.hasOwnProperty('StartLimitBurst') &&
		detailedInformations.hasOwnProperty('StartLimitAction') &&
		detailedInformations.hasOwnProperty('FailureAction') &&
		detailedInformations.hasOwnProperty('SuccessAction') &&
		detailedInformations.hasOwnProperty('CollectMode');
}
