const path = require('path');
const fs = require('fs');

const log = require('./log');

/**
 * Search the root dir of Git project recursively from appointed dir path.
 * @param {String} startPath The dir path where start to search.
 * @return {String|null} the root dir path of Git project. If not found, return null.
 */
function getGitRootDirPath(startPath, needLog) {
    startPath = path.resolve(startPath);

    let dotGitPath = path.join(startPath, '.git');

    if (
        fs.existsSync(startPath) &&
        fs.existsSync(dotGitPath) &&
        fs.lstatSync(dotGitPath).isDirectory()
    ) {
        if (needLog) {
            log(`Success: Found ".git" folder in ${startPath}`);
        }
        return startPath;
    } else {
        let parentPath = path.resolve(startPath, '..');

        // Stop if we are on top folder
        if (parentPath === startPath) {
            if (needLog) {
                log(`Not found any ".git" folder, stop searching.`);
            }
            return null;
        } else {
            // Continue to search from parent folder.
            if (needLog) {
                log(`Not found ".git" folder in ${startPath}, continue...`);
            }
            return getGitRootDirPath(parentPath, !!needLog);
        }
    }
}

module.exports = getGitRootDirPath;
