const path = require('path');
const execa = require('execa');

const {
    getGitStatus,
    getFilePathList,
    getPackageJsonDirPath,
    transPathWinToUnix,
    log
} = require('../../../../common/utils');
const { BATCH_CMD_PARAM_TOKEN } = require('../../../../common/const')();
const getPathFilter = require('./getPathFilter');

/**
 * Batch task executor
 * @param {Object} task shaped like
 *  {
 *      type: 'batch',
 *      command: 'eslint <paths>',
 *      filter: () => true,
 *      useRelativePath: true
 *  }
 * @return {Number} exit code, if no error occurs, it's 0, else it's non-zero.
 */
module.exports = (task) => {
    const scriptPath = process.argv[1];
    const cwd = path.resolve(scriptPath.split('node_modules')[0]);

    let command = task.command;

    // If batch task command doesn't contain "<paths>", exit process with error.
    if (command.indexOf(BATCH_CMD_PARAM_TOKEN) === -1) {
        log(`There is no "${BATCH_CMD_PARAM_TOKEN}" in batch task config, please check it.`, 1);
    }

    // Get file path list from output of "git status --porcelain"
    let pathList = getFilePathList(getGitStatus());
    if (!pathList.length) {
        log('There is no file to be commited, skip hook.', 0);
    }

    // Transform all paths to Unix format.
    // For example: 'C:\\a\\b' -> '/C/a/b'.
    pathList = pathList.map(transPathWinToUnix);

    // If "useRelativePath" is true, transform absolute paths to relative paths(relative to packageJsonDir).
    const PKG_JSON_DIR_PATH_UNIX = transPathWinToUnix(getPackageJsonDirPath());
    if (task.useRelativePath === true) {
        pathList = pathList.map(
            item => item.replace(PKG_JSON_DIR_PATH_UNIX, '.')
        );
    }

    if (task.filter) {
        const filter = getPathFilter(task.filter);
        if (!filter) {
            log(`Error occured when resolving the filter config of batch task, please check it.`, 1);
        }
        pathList = pathList.filter(filter);
    }

    if (!pathList.length) {
        log('There is no file path after filtering, skip hook.', 0);
    }

    // Get command and replace param.
    command = command.replace(BATCH_CMD_PARAM_TOKEN, pathList.join(' '));

    let exitCode = 0;

    try {
        let obj = execa.shellSync(command, {
            cwd,
            stdio: 'inherit'
        });
        exitCode = obj.status;
    } catch (e) {
        exitCode = e.code || 1;
    }

    return exitCode;
};
