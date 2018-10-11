const path = require('path');
const fs = require('fs');

const getGitRootDirPath = require('./getGitRootDirPath');

/**
 * Get list of absolute file paths from string of git status, only retaining
 * paths of new and modified file.
 * @param {String} gitStatusStr output of running "git status --porcelain"
 * @param {Object} testFlag just for testing.
 * @return {Array} list of paths
 */
function getFilePathList(gitStatusStr, testFlag) {
    testFlag = testFlag || {};
    const startIndex = 3;
    const gitRoot = testFlag.isTesting && testFlag.gitRoot ?
        testFlag.gitRoot : getGitRootDirPath(process.cwd());

    let pathList = gitStatusStr.split('\n')
        // Exclude strings which is empty or starts with "??"(Untraced paths)
        .filter(item => !!item && !/^\?\?/.test(item));

    // Transform to absolute path
    if (!(testFlag.isTesting && testFlag.skipMapToAbsPath)) {
        pathList = pathList.map(item => path.join(gitRoot ,item.substring(startIndex)));
    }

    // Confirm the path exists
    if (!(testFlag.isTesting && testFlag.skipFilterNotExist)) {
        pathList = pathList.filter(item => fs.existsSync(item));
    }

    return pathList;
}

module.exports = getFilePathList;
