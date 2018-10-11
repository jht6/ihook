const path = require('path');

const getGitRootDirPath = require('./getGitRootDirPath');
const log = require('./log');
const getGitStatus = require('./getGitStatus');
const getFilePathList = require('./getFilePathList');
const readPackageJson = require('./readPackageJson');
const modifyPackageJson = require('./modifyPackageJson');
const addPreCommitItem = require('./addPreCommitItem');
const transPathWinToUnix = require('./transPathWinToUnix');

module.exports = {
    getPackageJsonDirPath,
    getGitRootDirPath,
    log,
    getGitStatus,
    getFilePathList,
    readPackageJson,
    modifyPackageJson,
    addPreCommitItem,
    transPathWinToUnix
};

/**
 * Get absolute path of directory which contains the 'package.json'.
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *                     IMPORTANT
 *  This function depends on this file's position.
 *  If this file is move, notice to check the code.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function getPackageJsonDirPath() {
    return path.resolve(__dirname, '..', '..', '..', '..');
}
