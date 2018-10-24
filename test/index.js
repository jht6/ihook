/**
 * Entry of testing.
 */

const { log } = require('../common/utils');
const { execSync } = require('child_process');

// There are some Unix shell scripts in testing code,
// so if terminal doesn't support Unix shell (suach as CMD on Windows), stop running.
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

require('./unit/index');
require('./regression/index');
