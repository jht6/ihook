const path = require('path');
const fs = require('fs');

const getGitRootDirPath = require('./getGitRootDirPath');

/**
 * Get list of absolute file paths from string of git status, only retaining
 * paths of files which are being committed.
 *
 * According to git docs on https://git-scm.com/docs/git-status, we should parse
 * the paths with "M"/"A"/"R" status on X position, for example("*" at Y position means arbitrary status):
 * M* PATH1 // a file which has been committed already is modified and added into index now
 * A* PATH2 // a new file which has never been committed is added into index now
 * R* ORIG_PATH -> PATH // a file which has been committed already is renamed or moved to another position
 *
 * According to https://stackoverflow.com/questions/27198414/git-status-git-diff-c-not-detecting-file-copy-in-index,
 * we don't need to pay attension to the "C" status code.
 *
 * @param {String} gitStatusStr output of running "git status --porcelain"
 * @param {Object} testFlag just for testing.
 * @return {Array} list of paths
 */
function getFilePathList(gitStatusStr, testFlag) {
    testFlag = testFlag || {};
    const startIndex = 3;
    const gitRoot = testFlag.isTesting && testFlag.gitRoot ?
        testFlag.gitRoot : getGitRootDirPath(process.cwd());

    let pathList = gitStatusStr.replace(/\r/g, '').split('\n')
        .filter(item => {
            // only remain items whose first char is 'M' or 'A' or 'R'
            return !!item && /^[MAR]$/.test(item.charAt(0))
        })
        .map(item => {
            if (item.charAt(0) === 'R') {
                // take out "PATH" from "R* ORIG_PATH -> PATH"
                return /\s\->\s(.*)$/.exec(item)[1];
            } else {
                // take out "PATH" from "XY PATH"
                return item.substring(startIndex);
            }
        });

    // Transform to absolute path
    if (!(testFlag.isTesting && testFlag.skipMapToAbsPath)) {
        pathList = pathList.map(item => path.join(gitRoot ,item));
    }

    // Confirm the path exists
    if (!(testFlag.isTesting && testFlag.skipFilterNotExist)) {
        pathList = pathList.filter(item => fs.existsSync(item));
    }

    return pathList;
}

module.exports = getFilePathList;
