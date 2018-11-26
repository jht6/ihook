/**
 * Jest's "globalSetup", do some checking before running test.
 */

const { log } = require('../../common/utils');
const { execSync } = require('child_process');

module.exports = () => {
    // There are some Unix shell scripts in testing code,
    // so if terminal doesn't support Unix shell (such as CMD on Windows), stop running tests.
    try {
        execSync('cp --help', {
            stdio: 'ignore'
        });
    } catch (e) {
        log([
            'Maybe you are using CMD to run testing on Windows system.',
            'There are some shell scripts in testing code for convenience,',
            'so please use a terminal that support Unix Shell such as git-bash'
        ], 0);
    }
};
