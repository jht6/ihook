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
        // TODO: 打印具体的错误信息
        // 此处先简单打印tasks
        log(tasks, 1);
    }

    try {
        tasks.forEach(task => {
            let executor = executors[task.type];
            let exitCode = executor(task);
            if (exitCode !== 0) {
                log('hook failed', exitCode);
            }
        });
    } catch (e) {
        const canBypassHooks = [
            'commit-msg',
            'pre-commit',
            'pre-rebase',
            'pre-push'
        ].includes(hookName)
            ? '(add "--no-verify" or "-n" to bypass Git hook)'
            : '(cannot be bypassed with --no-verify due to Git specs)';
        log(`${hookName} hook failed ${canBypassHooks}`, e.code || 1);
    }
}

run();
