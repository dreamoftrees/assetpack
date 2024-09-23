import type { LogLevelKeys } from './logLevel.js';
import type { ReporterEvent } from './Reporter.js';
export interface LoggerOptions {
    level: LogLevelKeys;
}
declare class LoggerClass {
    private _reporter;
    init(options: LoggerOptions): void;
    verbose(message: string): void;
    log(message: string): void;
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    report(event: ReporterEvent): void;
}
export declare const Logger: LoggerClass;
export {};
