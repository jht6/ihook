'use strict';

const {
    log
} = require('../../common/utils');
const getResolvedTasks = require('./getResolvedTasks');
const executors = require('./executors');

function run() {
    const hookName = process.argv[2];
    let tasks = getResolvedTasks(process.argv);
    if (typeof tasks === 'string') {
        log('Please modify your ihook.config.js', 1);
    }

    let exitCode = 0;
    try {
        tasks.forEach(task => {
            let executor = executors[task.type];
            let code = executor(task);
            if (code !== 0) {
                exitCode = code;
            }
        });
    } catch (e) {
        exitCode = 1;
    }

    if (exitCode !== 0) {
        const canBypassHooks = [
            'commit-msg',
            'pre-commit',
            'pre-rebase',
            'pre-push'
        ].includes(hookName) ?
            '(add "--no-verify" or "-n" to bypass Git hook)' :
            '(cannot be bypassed with --no-verify due to Git specs)';
        log(`"${hookName}" hook failed, ${canBypassHooks}`, exitCode);
    }
}

run();
