export declare class Systemd {
    private installed;
    private serviceNames;
    private static sysd;
    constructor();
    private setup;
    private isInstalled;
    listNames(forceUpdate?: boolean): Promise<string[]>;
    listNames(forceUpdate: boolean | undefined, callback: (error: Error | null, services: string[]) => void): void;
    list(forceUpdate?: boolean): Promise<{
        [service: string]: BasicInformations;
    }>;
    list(forceUpdate: boolean | undefined, callback: (error: Error | null, services: {
        [service: string]: BasicInformations;
    }) => void): void;
    exists(service: string, forceUpdate?: boolean): Promise<boolean>;
    exists(service: string, forceUpdate: boolean | undefined, callback: (error: Error | null, exists: boolean) => void): void;
    basicInformations(service: string): Promise<BasicInformations>;
    basicInformations(service: string, callback: (error: Error | null, informations: BasicInformations) => void): void;
    detailedInformations(service: string): Promise<DetailedInformations>;
    detailedInformations(service: string, callback: (error: Error | null, informations: DetailedInformations) => void): void;
    loadState(service: string): Promise<LoadState>;
    loadState(service: string, callback: (error: Error | null, loadState: LoadState) => void): void;
    activeState(service: string): Promise<ActiveState>;
    activeState(service: string, callback: (error: Error | null, activeState: ActiveState) => void): void;
    unitFileState(service: string): Promise<UnitFileState>;
    unitFileState(service: string, callback: (error: Error | null, unitFileState: UnitFileState) => void): void;
    start(service: string): Promise<void>;
    start(service: string, callback: (error: Error | null) => void): void;
    stop(service: string): Promise<void>;
    stop(service: string, callback: (error: Error | null) => void): void;
    restart(service: string): Promise<void>;
    restart(service: string, callback: (error: Error | null) => void): void;
    enable(service: string): Promise<void>;
    enable(service: string, callback: (error: Error | null) => void): void;
    disable(service: string): Promise<void>;
    disable(service: string, callback: (error: Error | null) => void): void;
    mask(service: string): Promise<void>;
    mask(service: string, callback: (error: Error | null) => void): void;
    unmask(service: string): Promise<void>;
    unmask(service: string, callback: (error: Error | null) => void): void;
}
export declare type BasicInformations = {
    name: string;
    description: string;
    loadState: LoadState;
    activeState: ActiveState;
    subState: string;
    unitFileState: UnitFileState;
};
export declare type DetailedInformations = {
    Type: string;
    Restart: string;
    PIDFile: string | undefined;
    NotifyAccess: string;
    RestartUSec: string;
    TimeoutStartUSec: string;
    TimeoutStopUSec: string;
    RuntimeMaxUSec: string;
    WatchdogUSec: string;
    WatchdogTimestampMonotonic: string;
    RootDirectoryStartOnly: string;
    RemainAfterExit: string;
    GuessMainPID: string;
    MainPID: string;
    ControlPID: string;
    FileDescriptorStoreMax: string;
    NFileDescriptorStore: string;
    StatusErrno: string;
    Result: string;
    ReloadResult: string;
    UID: string;
    GID: string;
    NRestarts: string;
    ExecMainStartTimestampMonotonic: string;
    ExecMainExitTimestampMonotonic: string;
    ExecMainPID: string;
    ExecMainCode: string;
    ExecMainStatus: string;
    ExecStart: string;
    ExecReload: string | undefined;
    Slice: string;
    MemoryCurrent: string;
    CPUUsageNSec: string;
    TasksCurrent: string;
    IPIngressBytes: string;
    IPIngressPackets: string;
    IPEgressBytes: string;
    IPEgressPackets: string;
    Delegate: string;
    CPUAccounting: string;
    CPUWeight: string;
    StartupCPUWeight: string;
    CPUShares: string;
    StartupCPUShares: string;
    CPUQuotaPerSecUSec: string;
    CPUQuotaPeriodUSec: string;
    IOAccounting: string;
    IOWeight: string;
    StartupIOWeight: string;
    BlockIOAccounting: string;
    BlockIOWeight: string;
    StartupBlockIOWeight: string;
    MemoryAccounting: string;
    MemoryMin: string;
    MemoryLow: string;
    MemoryHigh: string;
    MemoryMax: string;
    MemorySwapMax: string;
    MemoryLimit: string;
    DevicePolicy: string;
    TasksAccounting: string;
    TasksMax: string;
    IPAccounting: string;
    UMask: string;
    LimitCPU: string;
    LimitCPUSoft: string;
    LimitFSIZE: string;
    LimitFSIZESoft: string;
    LimitDATA: string;
    LimitDATASoft: string;
    LimitSTACK: string;
    LimitSTACKSoft: string;
    LimitCORE: string;
    LimitCORESoft: string;
    LimitRSS: string;
    LimitRSSSoft: string;
    LimitNOFILE: string;
    LimitNOFILESoft: string;
    LimitAS: string;
    LimitASSoft: string;
    LimitNPROC: string;
    LimitNPROCSoft: string;
    LimitMEMLOCK: string;
    LimitMEMLOCKSoft: string;
    LimitLOCKS: string;
    LimitLOCKSSoft: string;
    LimitSIGPENDING: string;
    LimitSIGPENDINGSoft: string;
    LimitMSGQUEUE: string;
    LimitMSGQUEUESoft: string;
    LimitNICE: string;
    LimitNICESoft: string;
    LimitRTPRIO: string;
    LimitRTPRIOSoft: string;
    LimitRTTIME: string;
    LimitRTTIMESoft: string;
    OOMScoreAdjust: string;
    Nice: string;
    IOSchedulingClass: string;
    IOSchedulingPriority: string;
    CPUSchedulingPolicy: string;
    CPUSchedulingPriority: string;
    TimerSlackNSec: string;
    CPUSchedulingResetOnFork: string;
    NonBlocking: string;
    StandardInput: string;
    StandardInputData: string;
    StandardOutput: string;
    StandardError: string;
    TTYReset: string;
    TTYVHangup: string;
    TTYVTDisallocate: string;
    SyslogPriority: string;
    SyslogLevelPrefix: string;
    SyslogLevel: string;
    SyslogFacility: string;
    LogLevelMax: string;
    LogRateLimitIntervalUSec: string;
    LogRateLimitBurst: string;
    SecureBits: string;
    CapabilityBoundingSet: string;
    AmbientCapabilities: string;
    DynamicUser: string;
    RemoveIPC: string;
    MountFlags: string;
    PrivateTmp: string;
    PrivateDevices: string;
    ProtectKernelTunables: string;
    ProtectKernelModules: string;
    ProtectControlGroups: string;
    PrivateNetwork: string;
    PrivateUsers: string;
    PrivateMounts: string;
    ProtectHome: string;
    ProtectSystem: string;
    SameProcessGroup: string;
    UtmpMode: string;
    IgnoreSIGPIPE: string;
    NoNewPrivileges: string;
    SystemCallErrorNumber: string;
    LockPersonality: string;
    RuntimeDirectoryPreserve: string;
    RuntimeDirectoryMode: string;
    StateDirectoryMode: string;
    CacheDirectoryMode: string;
    LogsDirectoryMode: string;
    ConfigurationDirectoryMode: string;
    MemoryDenyWriteExecute: string;
    RestrictRealtime: string;
    RestrictSUIDSGID: string;
    RestrictNamespaces: string;
    MountAPIVFS: string;
    KeyringMode: string;
    ProtectHostname: string;
    KillMode: string;
    KillSignal: string;
    FinalKillSignal: string;
    SendSIGKILL: string;
    SendSIGHUP: string;
    WatchdogSignal: string;
    Id: string;
    Names: string;
    Requires: string;
    Conflicts: string;
    Before: string;
    After: string;
    Description: string;
    LoadState: string;
    ActiveState: string;
    SubState: string;
    FragmentPath: string;
    UnitFileState: string;
    UnitFilePreset: string;
    StateChangeTimestampMonotonic: string;
    InactiveExitTimestampMonotonic: string;
    ActiveEnterTimestampMonotonic: string;
    ActiveExitTimestampMonotonic: string;
    InactiveEnterTimestampMonotonic: string;
    CanStart: string;
    CanStop: string;
    CanReload: string;
    CanIsolate: string;
    StopWhenUnneeded: string;
    RefuseManualStart: string;
    RefuseManualStop: string;
    AllowIsolate: string;
    DefaultDependencies: string;
    OnFailureJobMode: string;
    IgnoreOnIsolate: string;
    NeedDaemonReload: string;
    JobTimeoutUSec: string;
    JobRunningTimeoutUSec: string;
    JobTimeoutAction: string;
    ConditionResult: string;
    AssertResult: string;
    ConditionTimestampMonotonic: string;
    AssertTimestampMonotonic: string;
    Transient: string;
    Perpetual: string;
    StartLimitIntervalUSec: string;
    StartLimitBurst: string;
    StartLimitAction: string;
    FailureAction: string;
    SuccessAction: string;
    CollectMode: string;
};
export declare type LoadState = 'stub' | 'loaded' | 'not-found' | 'bad-setting' | 'error' | 'merged' | 'masked';
export declare type ActiveState = 'active' | 'reloading' | 'inactive' | 'failed' | 'activating' | 'deactivating';
export declare type SubState = 'dead' | 'start-pre' | 'start' | 'start-post' | 'running' | 'exited' | 'reload' | 'stop' | 'stop-watchdog' | 'stop-sigterm' | 'stop-sigkill' | 'stop-post' | 'final-sigterm' | 'final-sigkill' | 'failed' | 'auto-restart';
export declare type UnitFileState = 'enabled' | 'disabled' | 'indirect' | 'static' | 'enabled-runtime' | 'masked' | '';
