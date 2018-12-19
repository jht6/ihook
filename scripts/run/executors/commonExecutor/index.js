const execa = require('execa');
const { log } = require('../../../../common/utils');

/**
 * Common task executor
 * @param {Object} task shaped like { type: 'common', command: 'npm test' }
 * @return {Number} exit code, if no error occurs, it's 0, else it's non-zero.
 */
module.exports = (task) => {
    let exitCode = 0;

    try {
        log(`run "${task.command}"`);

        execa.shellSync(task.command, {
            cwd: task.cwd,
            stdio: 'inherit'
        });
        exitCode = 0;
    } catch (e) {
        exitCode = e.code || 1;
    }

    return exitCode;
};
