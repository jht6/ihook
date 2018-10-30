const path = require('path');

const getGitRootDirPath = require('./getGitRootDirPath');
const log = require('./log');
const getGitStatus = require('./getGitStatus');
const getFilePathList = require('./getFilePathList');
const readPackageJson = require('./readPackageJson');
const modifyPackageJson = require('./modifyPackageJson');
const addPreCommitItem = require('./addPreCommitItem');
const transPathWinToUnix = require('./transPathWinToUnix');
const isInNestedNodeModules = require('./isInNestedNodeModules');
const getIhookDirPath = require('./getIhookDirPath');
const getRealDotGitDirPath = require('./getRealDotGitDirPath');

module.exports = {
    getPackageJsonDirPath,
    getGitRootDirPath,
    log,
    getGitStatus,
    getFilePathList,
    readPackageJson,
    modifyPackageJson,
    addPreCommitItem,
    transPathWinToUnix,
    isInNestedNodeModules,
    getIhookDirPath,
    getRealDotGitDirPath
};

/**
 * Get absolute path of directory which contains the 'package.json'.
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *                     IMPORTANT
 *  This function depends on this file's position.
 *  If this file is moved, notice to check the code.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function getPackageJsonDirPath() {
    return path.resolve(__dirname, '..', '..', '..', '..');
}
