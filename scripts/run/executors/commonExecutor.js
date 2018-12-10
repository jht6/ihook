const path = require('path');
const execa = require('execa');

/**
 * Common task executor
 * @param {Object} task shaped like { type: 'common', command: 'npm test' }
 * @return {Number} exit code, if no error occurs, it's 0, else it's non-zero.
 */
module.exports = (task) => {
    const scriptPath = process.argv[1];
    const cwd = scriptPath.indexOf('node_modules') > -1 ?
        path.resolve(scriptPath.split('node_modules')[0]) :
        __dirname; // for testing

    let exitCode = 0;

    try {
        execa.shellSync(task.command, {
            cwd,
            stdio: 'inherit'
        });
        exitCode = 0;
    } catch (e) {
        exitCode = e.code || 1;
    }

    return exitCode;
};
