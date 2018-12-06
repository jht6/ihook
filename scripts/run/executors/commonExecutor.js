const path = require('path');
const execa = require('execa');

/**
 * Common task executor
 * @param {Object} task shaped like { type: 'common', command: 'npm test' }
 * @return {Number} exit code, if no error occurs, it's 0, else it's non-zero.
 */
module.exports = (task) => {
    const scriptPath = process.argv[1];
    const cwd = path.resolve(scriptPath.split('node_modules')[0]);

    let exitCode = 0;

    try {
        let obj = execa.shellSync(task.command, {
            cwd,
            stdio: 'inherit'
        });
        exitCode = obj.status;
    } catch (e) {
        exitCode = e.code || 1;
    }

    return exitCode;
};
