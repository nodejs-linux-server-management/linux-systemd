import { Systemd, BasicInformations, DetailedInformations, LoadState, ActiveState, UnitFileState } from "./Systemd";

/**
 * @throws
 */
export function systemd(): Systemd {
	try {
		return new Systemd();
	} catch (e) {
		throw e
	}
}

export function listNames(): Promise<string[]>;
export function listNames(callback: (error: Error | null, services: string[]) => void): void;
export function listNames(callback?: (error: Error | null, services: string[]) => void): Promise<string[]> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().listNames();
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().listNames(undefined, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function list(): Promise<{ [service: string]: BasicInformations }>;
export function list(callback: (error: Error | null, services: { [service: string]: BasicInformations }) => void): void;
export function list(callback?: (error: Error | null, services: { [service: string]: BasicInformations }) => void): Promise<{ [service: string]: BasicInformations }> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().list();
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().list(undefined, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function exists(service: string): Promise<boolean>;
export function exists(service: string, callback: (error: Error | null, exists: boolean) => void): void;
export function exists(service: string, callback?: (error: Error | null, exists: boolean) => void): Promise<boolean> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().exists(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().exists(service, undefined, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function basicInformations(service: string): Promise<BasicInformations>;
export function basicInformations(service: string, callback: (error: Error | null, informations: BasicInformations) => void): void;
export function basicInformations(service: string, callback?: (error: Error | null, informations: BasicInformations) => void): Promise<BasicInformations> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().basicInformations(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().basicInformations(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function detailedInformations(service: string): Promise<DetailedInformations>;
export function detailedInformations(service: string, callback: (error: Error | null, informations: DetailedInformations) => void): void;
export function detailedInformations(service: string, callback?: (error: Error | null, informations: DetailedInformations) => void): Promise<DetailedInformations> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().detailedInformations(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().detailedInformations(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function loadState(service: string): Promise<LoadState>;
export function loadState(service: string, callback: (error: Error | null, loadState: LoadState) => void): void;
export function loadState(service: string, callback?: (error: Error | null, loadState: LoadState) => void): Promise<LoadState> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().loadState(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().loadState(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function activeState(service: string): Promise<ActiveState>;
export function activeState(service: string, callback: (error: Error | null, activeState: ActiveState) => void): void;
export function activeState(service: string, callback?: (error: Error | null, activeState: ActiveState) => void): Promise<ActiveState> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().activeState(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().activeState(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function unitFileState(service: string): Promise<UnitFileState>;
export function unitFileState(service: string, callback: (error: Error | null, unitFileState: UnitFileState) => void): void;
export function unitFileState(service: string, callback?: (error: Error | null, unitFileState: UnitFileState) => void): Promise<UnitFileState> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().unitFileState(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().unitFileState(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function start(service: string): Promise<void>;
export function start(service: string, callback: (error: Error | null) => void): void;
export function start(service: string, callback ?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().start(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().start(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function stop(service: string): Promise<void>;
export function stop(service: string, callback: (error: Error | null) => void): void;
export function stop(service: string, callback ?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().stop(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().stop(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function restart(service: string): Promise<void>;
export function restart(service: string, callback: (error: Error | null) => void): void;
export function restart(service: string, callback ?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().restart(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().restart(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function enable(service: string): Promise<void>;
export function enable(service: string, callback: (error: Error | null) => void): void;
export function enable(service: string, callback ?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().enable(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().enable(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function disable(service: string): Promise<void>;
export function disable(service: string, callback: (error: Error | null) => void): void;
export function disable(service: string, callback ?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().disable(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().disable(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function mask(service: string): Promise<void>;
export function mask(service: string, callback: (error: Error | null) => void): void;
export function mask(service: string, callback ?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().mask(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().mask(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function unmask(service: string): Promise<void>;
export function unmask(service: string, callback: (error: Error | null) => void): void;
export function unmask(service: string, callback ?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return systemd().unmask(service);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			systemd().unmask(service, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}
