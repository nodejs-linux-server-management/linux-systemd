import { Systemd, BasicInformations, DetailedInformations, LoadState, ActiveState, UnitFileState } from "./Systemd";
/**
 * @throws
 */
export declare function systemd(): Systemd;
export declare function listNames(): Promise<string[]>;
export declare function listNames(callback: (error: Error | null, services: string[]) => void): void;
export declare function list(): Promise<{
    [service: string]: BasicInformations;
}>;
export declare function list(callback: (error: Error | null, services: {
    [service: string]: BasicInformations;
}) => void): void;
export declare function exists(service: string): Promise<boolean>;
export declare function exists(service: string, callback: (error: Error | null, exists: boolean) => void): void;
export declare function basicInformations(service: string): Promise<BasicInformations>;
export declare function basicInformations(service: string, callback: (error: Error | null, informations: BasicInformations) => void): void;
export declare function detailedInformations(service: string): Promise<DetailedInformations>;
export declare function detailedInformations(service: string, callback: (error: Error | null, informations: DetailedInformations) => void): void;
export declare function loadState(service: string): Promise<LoadState>;
export declare function loadState(service: string, callback: (error: Error | null, loadState: LoadState) => void): void;
export declare function activeState(service: string): Promise<ActiveState>;
export declare function activeState(service: string, callback: (error: Error | null, activeState: ActiveState) => void): void;
export declare function unitFileState(service: string): Promise<UnitFileState>;
export declare function unitFileState(service: string, callback: (error: Error | null, unitFileState: UnitFileState) => void): void;
export declare function start(service: string): Promise<void>;
export declare function start(service: string, callback: (error: Error | null) => void): void;
export declare function stop(service: string): Promise<void>;
export declare function stop(service: string, callback: (error: Error | null) => void): void;
export declare function restart(service: string): Promise<void>;
export declare function restart(service: string, callback: (error: Error | null) => void): void;
export declare function enable(service: string): Promise<void>;
export declare function enable(service: string, callback: (error: Error | null) => void): void;
export declare function disable(service: string): Promise<void>;
export declare function disable(service: string, callback: (error: Error | null) => void): void;
export declare function mask(service: string): Promise<void>;
export declare function mask(service: string, callback: (error: Error | null) => void): void;
export declare function unmask(service: string): Promise<void>;
export declare function unmask(service: string, callback: (error: Error | null) => void): void;
