const path = require('path');
const spawn = require('cross-spawn');

const log = require('./log');
const getGitRootDirPath = require('./getGitRootDirPath');

/**
 * Execute "git status --porcelain" in Git project root folder,
 * and get a status string that can be parsed simply.
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *                     IMPORTANT
 *  This function depends on this file's position.
 *  If this file is move, notice to check the code.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * @return {String} string of git status
 */
function getGitStatus() {
    let status = '';
    let startPath = path.resolve(__dirname, '../../../..');
    try {
        status = spawn.sync('git', ['status', '--porcelain'], {
            stdio: 'pipe',
            cwd: getGitRootDirPath(startPath)
        }).stdout.toString();

        return status;
    } catch (e) {
        log([
            `Fail: run "git status --porcelain",`,
            `Skipping running foreach.`
        ], 0);
    }
}

module.exports = getGitStatus;
