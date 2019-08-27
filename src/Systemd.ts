import { platform } from "os";
import { execute } from "linux-shell-command";
import { isPackageInstalled } from "linux-package-manager";

export class Systemd {

	private installed: { systemd: null | boolean, sudo: null | boolean } = { systemd: null, sudo: null };
	private serviceNames: null | string[] = null;

	private static sysd: Systemd;

	constructor() {
		if (platform() !== 'linux') {
			throw Error("This module only runs on linux");
		}
	}

	private setup(): Promise<void> {
		return new Promise((resolve, reject) => {
			isPackageInstalled('systemd').then((installed) => {
				this.installed.systemd = installed;
				isPackageInstalled('sudo').then((installed) => {
					this.installed.sudo = installed;
					resolve();
				}).catch((e) => {
					reject(e);
				});
			}).catch((e) => {
				reject(e);
			});
		});
	}

	private isInstalled(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.installed.systemd === null || this.installed.sudo === null) {
				this.setup().then(() => {
					this.isInstalled().then(() => resolve()).catch((e) => reject(e));
				}).catch((e) => {
					reject(e);
				});
			} else if (this.installed.systemd === true && this.installed.sudo === true) {
				resolve();
			} else if (this.installed.systemd === true) {
				reject(Error('sudo isn\'t installed'));
			} else if (this.installed.sudo === true) {
				reject(Error('systemd isn\'t installed'));
			} else {
				reject(Error('sudo and systemd aren\'t installed'));
			}
		});
	}

	//Informations

	public listNames(forceUpdate?: boolean): Promise<string[]>;
	public listNames(forceUpdate: boolean | undefined, callback: (error: Error | null, services: string[]) => void): void;
	public listNames(forceUpdate: boolean = false, callback?: (error: Error | null, services: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]>;
		if (this.serviceNames === null || forceUpdate === true) {
			result = new Promise((resolve, reject) => {
				this.isInstalled().then(() => {
					execute('systemctl list-unit-files -alt service --no-legend --no-pager | cut -d \' \' -f1').then(({ shellCommand, success }) => {
						if (success === true) {
							this.serviceNames = shellCommand.stdout.trim().split('\n').filter((name) => !name.includes('@'));
							resolve(this.serviceNames);
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				}).catch((e) => {
					reject(e);
				});
			});
		} else {
			result = Promise.resolve(this.serviceNames);
		}

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((services) => {
				callback(null, services);
			}).catch((e) => {
				//@ts-ignore;
				callback(e)
			});
		}
	}

	public list(forceUpdate?: boolean): Promise<{ [service: string]: BasicInformations }>;
	public list(forceUpdate: boolean | undefined, callback: (error: Error | null, services: { [service: string]: BasicInformations }) => void): void;
	public list(forceUpdate: boolean = false, callback?: (error: Error | null, services: { [service: string]: BasicInformations }) => void): Promise<{ [service: string]: BasicInformations }> | void {
		var result: Promise<{ [service: string]: BasicInformations }> = new Promise((resolve, reject) => {
			this.listNames(forceUpdate).then((names) => {
				var command = 'systemctl show \'!?!\' --no-pager -p Names,Description,LoadState,ActiveState,SubState,UnitFileState';
				command = command.replace(/'\!\?\!'/, new Array(names.length).fill("'!?!'").join(' '));
				execute(command, names).then(({ shellCommand, success }) => {
					if (success === true) {
						var services: { [service: string]: BasicInformations } = {};
						var informations = shellCommand.stdout.trim().split('\n\n');
						for (let i = 0; i < informations.length; i++) {
							let service = informations[i].trim().split('\n');
							let name = service[0].split('=')[1];
							services[name] = {
								name: name,
								description: service[1].split('=')[1],
								loadState: <LoadState>service[2].split('=')[1],
								activeState: <ActiveState>service[3].split('=')[1],
								subState: service[4].split('=')[1],
								unitFileState: <UnitFileState>service[5].split('=')[1],
							};
						}
						resolve(services);
					} else {
						reject(shellCommand.error);
					}
				}).catch((e) => {
					reject(e);
				});
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((services) => {
				callback(null, services);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public exists(service: string, forceUpdate?: boolean): Promise<boolean>;
	public exists(service: string, forceUpdate: boolean | undefined, callback: (error: Error | null, exists: boolean) => void): void;
	public exists(service: string, forceUpdate: boolean = false, callback?: (error: Error | null, exists: boolean) => void): Promise<boolean> | void {
		var result: Promise<boolean> = new Promise((resolve, reject) => {
			service = service.trim();
			if (!service.includes(' ')) {
				if (!service.includes('.service')) {
					service = `${service}.service`;
				}
				this.listNames(forceUpdate).then((names) => {
					resolve(names.includes(service));
				}).catch((e) => {
					reject(e);
				});
			} else {
				reject(Error('A service name cannot contain space'));
			}
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((exists) => {
				callback(null, exists);
			}).catch((e) => {
				setTimeout(() => {
					//@ts-ignore
					callback(e);
				});
			});
		}
	}

	public basicInformations(service: string): Promise<BasicInformations>;
	public basicInformations(service: string, callback: (error: Error | null, informations: BasicInformations) => void): void;
	public basicInformations(service: string, callback?: (error: Error | null, informations: BasicInformations) => void): Promise<BasicInformations> | void {
		var result: Promise<BasicInformations> = new Promise((resolve, reject) => {
			this.exists(service).then((exists) => {
				if (exists === true) {
					execute('systemctl show \'!?!\' --no-pager -p Names,Description,LoadState,ActiveState,SubState,UnitFileState', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							let service = shellCommand.stdout.trim().split('\n');
							resolve({
								name: service[0].split('=')[1],
								description: service[1].split('=')[1],
								loadState: <LoadState>service[2].split('=')[1],
								activeState: <ActiveState>service[3].split('=')[1],
								subState: service[4].split('=')[1],
								unitFileState: <UnitFileState>service[5].split('=')[1]
							});
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`The service "${service}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((informations) => {
				callback(null, informations);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public detailedInformations(service: string): Promise<DetailedInformations>;
	public detailedInformations(service: string, callback: (error: Error | null, informations: DetailedInformations) => void): void;
	public detailedInformations(service: string, callback?: (error: Error | null, informations: DetailedInformations) => void): Promise<DetailedInformations> | void {
		var result: Promise<DetailedInformations> = new Promise((resolve, reject) => {
			this.exists(service).then((exists) => {
				if (exists === true) {
					execute('systemctl show \'!?!\' --no-pager', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							var buf = shellCommand.stdout.trim().split('\n');
							var informations: { [key: string]: string } = {};
							for (let i = 0; i < buf.length; i++) {
								let information = buf[i].split('=');
								informations[information[0]] = information[1];
							}
							resolve(<DetailedInformations>informations);
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`The service "${service}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((informations) => {
				callback(null, informations);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public loadState(service: string): Promise<LoadState>;
	public loadState(service: string, callback: (error: Error | null, loadState: LoadState) => void): void;
	public loadState(service: string, callback?: (error: Error | null, loadState: LoadState) => void): Promise<LoadState> | void {
		var result: Promise<LoadState> = new Promise((resolve, reject) => {
			this.exists(service).then((exists) => {
				if (exists === true) {
					execute('systemctl show \'!?!\' --no-pager -p LoadState --value', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve(<LoadState>shellCommand.stdout.trim());
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`The service "${service}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((loadState) => {
				callback(null, loadState);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public activeState(service: string): Promise<ActiveState>;
	public activeState(service: string, callback: (error: Error | null, activeState: ActiveState) => void): void;
	public activeState(service: string, callback?: (error: Error | null, activeState: ActiveState) => void): Promise<ActiveState> | void {
		var result: Promise<ActiveState> = new Promise((resolve, reject) => {
			this.exists(service).then((exists) => {
				if (exists === true) {
					execute('systemctl show \'!?!\' --no-pager -p ActiveState --value', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve(<ActiveState>shellCommand.stdout.trim());
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`The service "${service}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((activeState) => {
				callback(null, activeState);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public unitFileState(service: string): Promise<UnitFileState>;
	public unitFileState(service: string, callback: (error: Error | null, unitFileState: UnitFileState) => void): void;
	public unitFileState(service: string, callback?: (error: Error | null, unitFileState: UnitFileState) => void): Promise<UnitFileState> | void {
		var result: Promise<UnitFileState> = new Promise((resolve, reject) => {
			this.exists(service).then((exists) => {
				if (exists === true) {
					execute('systemctl show \'!?!\' --no-pager -p UnitFileState --value', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve(<UnitFileState>shellCommand.stdout.trim());
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`The service "${service}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((unitFileState) => {
				callback(null, unitFileState);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	//Actions

	public start(service: string): Promise<void>;
	public start(service: string, callback: (error: Error | null) => void): void;
	public start(service: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.activeState(service).then((activeState) => {
				if (activeState === 'inactive') {
					execute('sudo systemctl start \'!?!\'', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`To be started the service should be inactive but his current active state is ${activeState}`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public stop(service: string): Promise<void>;
	public stop(service: string, callback: (error: Error | null) => void): void;
	public stop(service: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.activeState(service).then((activeState) => {
				if (activeState === 'active') {
					execute('sudo systemctl stop \'!?!\'', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`To be stopped the service should be active but his current active state is ${activeState}`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public restart(service: string): Promise<void>;
	public restart(service: string, callback: (error: Error | null) => void): void;
	public restart(service: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.activeState(service).then((activeState) => {
				if (activeState === 'active') {
					execute('sudo systemctl restart \'!?!\'', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(Error(`To be restarted the service should be active but his current active state is ${activeState}`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public enable(service: string): Promise<void>;
	public enable(service: string, callback: (error: Error | null) => void): void;
	public enable(service: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.unitFileState(service).then((unitFileState) => {
				if (unitFileState === 'masked') {
					reject(Error('The service is currently masked and cannot be enabled'));
				} else if (unitFileState !== 'enabled') {
					execute('sudo systemctl enable \'!?!\'', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					// reject(Error('The service is already enabled'));
					resolve();
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public disable(service: string): Promise<void>;
	public disable(service: string, callback: (error: Error | null) => void): void;
	public disable(service: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.unitFileState(service).then((unitFileState) => {
				if (unitFileState === 'masked') {
					reject(Error('The service is currently masked and cannot be disabled'));
				} else if (unitFileState !== 'disabled') {
					execute('sudo systemctl disable \'!?!\'', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					// reject(Error('The service is already disabled'));
					resolve();
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public mask(service: string): Promise<void>;
	public mask(service: string, callback: (error: Error | null) => void): void;
	public mask(service: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.unitFileState(service).then((unitFileState) => {
				if (unitFileState !== 'masked') {
					execute('sudo systemctl mask \'!?!\'', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					// reject(Error('The service is already masked'));
					resolve();
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public unmask(service: string): Promise<void>;
	public unmask(service: string, callback: (error: Error | null) => void): void;
	public unmask(service: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.unitFileState(service).then((unitFileState) => {
				if (unitFileState === 'masked') {
					execute('sudo systemctl unmask \'!?!\'', [service]).then(({ shellCommand, success }) => {
						if (success === true) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					// reject(Error('The service isn\'t masked'));
					resolve();
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}
}

export type BasicInformations = {
	name: string,
	description: string,
	loadState: LoadState,
	activeState: ActiveState,
	subState: string,
	unitFileState: UnitFileState
};

export type DetailedInformations = {
	Type: string,
	Restart: string,
	PIDFile: string | undefined,
	NotifyAccess: string,
	RestartUSec: string,
	TimeoutStartUSec: string,
	TimeoutStopUSec: string,
	RuntimeMaxUSec: string,
	WatchdogUSec: string,
	WatchdogTimestampMonotonic: string,
	RootDirectoryStartOnly: string,
	RemainAfterExit: string,
	GuessMainPID: string,
	MainPID: string,
	ControlPID: string,
	FileDescriptorStoreMax: string,
	NFileDescriptorStore: string,
	StatusErrno: string,
	Result: string,
	ReloadResult: string,
	UID: string,
	GID: string,
	NRestarts: string,
	ExecMainStartTimestampMonotonic: string,
	ExecMainExitTimestampMonotonic: string,
	ExecMainPID: string,
	ExecMainCode: string,
	ExecMainStatus: string,
	ExecStart: string,
	ExecReload: string | undefined,
	Slice: string,
	MemoryCurrent: string,
	CPUUsageNSec: string,
	TasksCurrent: string,
	IPIngressBytes: string,
	IPIngressPackets: string,
	IPEgressBytes: string,
	IPEgressPackets: string,
	Delegate: string,
	CPUAccounting: string,
	CPUWeight: string,
	StartupCPUWeight: string,
	CPUShares: string,
	StartupCPUShares: string,
	CPUQuotaPerSecUSec: string,
	CPUQuotaPeriodUSec: string,
	IOAccounting: string,
	IOWeight: string,
	StartupIOWeight: string,
	BlockIOAccounting: string,
	BlockIOWeight: string,
	StartupBlockIOWeight: string,
	MemoryAccounting: string,
	MemoryMin: string,
	MemoryLow: string,
	MemoryHigh: string,
	MemoryMax: string,
	MemorySwapMax: string,
	MemoryLimit: string,
	DevicePolicy: string,
	TasksAccounting: string,
	TasksMax: string,
	IPAccounting: string,
	UMask: string,
	LimitCPU: string,
	LimitCPUSoft: string,
	LimitFSIZE: string,
	LimitFSIZESoft: string,
	LimitDATA: string,
	LimitDATASoft: string,
	LimitSTACK: string,
	LimitSTACKSoft: string,
	LimitCORE: string,
	LimitCORESoft: string,
	LimitRSS: string,
	LimitRSSSoft: string,
	LimitNOFILE: string,
	LimitNOFILESoft: string,
	LimitAS: string,
	LimitASSoft: string,
	LimitNPROC: string,
	LimitNPROCSoft: string,
	LimitMEMLOCK: string,
	LimitMEMLOCKSoft: string,
	LimitLOCKS: string,
	LimitLOCKSSoft: string,
	LimitSIGPENDING: string,
	LimitSIGPENDINGSoft: string,
	LimitMSGQUEUE: string,
	LimitMSGQUEUESoft: string,
	LimitNICE: string,
	LimitNICESoft: string,
	LimitRTPRIO: string,
	LimitRTPRIOSoft: string,
	LimitRTTIME: string,
	LimitRTTIMESoft: string,
	OOMScoreAdjust: string,
	Nice: string,
	IOSchedulingClass: string,
	IOSchedulingPriority: string,
	CPUSchedulingPolicy: string,
	CPUSchedulingPriority: string,
	TimerSlackNSec: string,
	CPUSchedulingResetOnFork: string,
	NonBlocking: string,
	StandardInput: string,
	StandardInputData: string,
	StandardOutput: string,
	StandardError: string,
	TTYReset: string,
	TTYVHangup: string,
	TTYVTDisallocate: string,
	SyslogPriority: string,
	SyslogLevelPrefix: string,
	SyslogLevel: string,
	SyslogFacility: string,
	LogLevelMax: string,
	LogRateLimitIntervalUSec: string,
	LogRateLimitBurst: string,
	SecureBits: string,
	CapabilityBoundingSet: string,
	AmbientCapabilities: string,
	DynamicUser: string,
	RemoveIPC: string,
	MountFlags: string,
	PrivateTmp: string,
	PrivateDevices: string,
	ProtectKernelTunables: string,
	ProtectKernelModules: string,
	ProtectControlGroups: string,
	PrivateNetwork: string,
	PrivateUsers: string,
	PrivateMounts: string,
	ProtectHome: string,
	ProtectSystem: string,
	SameProcessGroup: string,
	UtmpMode: string,
	IgnoreSIGPIPE: string,
	NoNewPrivileges: string,
	SystemCallErrorNumber: string,
	LockPersonality: string,
	RuntimeDirectoryPreserve: string,
	RuntimeDirectoryMode: string,
	StateDirectoryMode: string,
	CacheDirectoryMode: string,
	LogsDirectoryMode: string,
	ConfigurationDirectoryMode: string,
	MemoryDenyWriteExecute: string,
	RestrictRealtime: string,
	RestrictSUIDSGID: string,
	RestrictNamespaces: string,
	MountAPIVFS: string,
	KeyringMode: string,
	ProtectHostname: string,
	KillMode: string,
	KillSignal: string,
	FinalKillSignal: string,
	SendSIGKILL: string,
	SendSIGHUP: string,
	WatchdogSignal: string,
	Id: string,
	Names: string,
	Requires: string,
	Conflicts: string,
	Before: string,
	After: string,
	Description: string,
	LoadState: string,
	ActiveState: string,
	SubState: string,
	FragmentPath: string,
	UnitFileState: string,
	UnitFilePreset: string,
	StateChangeTimestampMonotonic: string,
	InactiveExitTimestampMonotonic: string,
	ActiveEnterTimestampMonotonic: string,
	ActiveExitTimestampMonotonic: string,
	InactiveEnterTimestampMonotonic: string,
	CanStart: string,
	CanStop: string,
	CanReload: string,
	CanIsolate: string,
	StopWhenUnneeded: string,
	RefuseManualStart: string,
	RefuseManualStop: string,
	AllowIsolate: string,
	DefaultDependencies: string,
	OnFailureJobMode: string,
	IgnoreOnIsolate: string,
	NeedDaemonReload: string,
	JobTimeoutUSec: string,
	JobRunningTimeoutUSec: string,
	JobTimeoutAction: string,
	ConditionResult: string,
	AssertResult: string,
	ConditionTimestampMonotonic: string,
	AssertTimestampMonotonic: string,
	Transient: string,
	Perpetual: string,
	StartLimitIntervalUSec: string,
	StartLimitBurst: string,
	StartLimitAction: string,
	FailureAction: string,
	SuccessAction: string,
	CollectMode: string
}

export type LoadState = 'stub' | 'loaded' | 'not-found' | 'bad-setting' | 'error' | 'merged' | 'masked';

export type ActiveState = 'active' | 'reloading' | 'inactive' | 'failed' | 'activating' | 'deactivating';

export type SubState = 'dead' | 'start-pre' | 'start' | 'start-post' | 'running' | 'exited' | 'reload' | 'stop' | 'stop-watchdog' | 'stop-sigterm' | 'stop-sigkill' | 'stop-post' | 'final-sigterm' | 'final-sigkill' | 'failed' | 'auto-restart';

export type UnitFileState = 'enabled' | 'disabled' | 'indirect' | 'static' | 'enabled-runtime' | 'masked' | '';
