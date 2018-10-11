const { LOG_PREFIX } = require('../const')();

/**
 * Write message to the terminal.
 * If exitCode is passed in, "process.exit(exitCode)" will be called.
 * @param {Array|String} lines The messages that need to be written.
 * @param {Number} exitCode Exit code for the process.exit.
 * @param {Object} opt Options for printing:
 *   noColor: if set as true, there will be no color under log prefix.
 * @param {Boolean} isTesting Options for unit testing, you shouldn't use it.
 */
function log(lines, exitCode, opt, isTesting) {
    opt = opt || {};

    if (!Array.isArray(lines)) {
        lines = lines.split('\n');
    }

    let prefix = opt.noColor ?
        `${LOG_PREFIX} ` :
        `\u001b[38;5;166m${LOG_PREFIX}\u001b[39;49m `;

    lines.push(''); // Whitespace at the end of the log.
    lines.unshift(''); // Whitespace at the beginning.

    lines = lines.map(line => prefix + line);

    lines.forEach(line => {
        if (typeof exitCode === 'number' && exitCode > 0) {
            console.error(line);
        } else {
            console.log(line);
        }
    });

    if (isTesting) {
        return {
            lines,
            exitCode
        };
    } else if (typeof exitCode === 'number') {
        process.exit(exitCode);
    }
}

module.exports = log;
