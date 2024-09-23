import { Reporter } from './Reporter.js';
class LoggerClass {
    _reporter = new Reporter();
    init(options) {
        this._reporter.level = options.level || 'info';
    }
    verbose(message) {
        this.report({
            type: 'log',
            level: 'verbose',
            message,
        });
    }
    log(message) {
        this.info(message);
    }
    info(message) {
        this.report({
            type: 'log',
            level: 'info',
            message,
        });
    }
    error(message) {
        this.report({
            type: 'log',
            level: 'error',
            message,
        });
    }
    warn(message) {
        this.report({
            type: 'log',
            level: 'warn',
            message,
        });
    }
    report(event) {
        this._reporter.report(event);
    }
}
export const Logger = new LoggerClass();
//# sourceMappingURL=Logger.js.map