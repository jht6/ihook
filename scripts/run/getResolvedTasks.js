const path = require('path');
const {
    getConfig,
    log
} = require('../../common/utils');
const {
    CONFIG_FILE_NAME
} = require('../../common/const');

const exitCode = {
    SKIP_HOOK: 'SKIP_HOOK',
    HOOKS_INVALID: 'HOOKS_INVALID',
    HOOK_CONFIG_INVALID: 'HOOK_CONFIG_INVALID',
    TASKS_INVALID: 'TASKS_INVALID',
    NO_HOOK_CONFIG: 'NO_HOOK_CONFIG',
    NO_TASKS: 'NO_TASKS'
};
const errorMsg = {
    [exitCode.NO_HOOKS]: `Your config hasn't "hooks" property, please check "${CONFIG_FILE_NAME}"`,
    [exitCode.NO_TASKS]: `Your config hasn't "tasks" property in "${process.argv[2]}", please check "${CONFIG_FILE_NAME}`
};

// take the dir which contains "node_modules" as cwd
const cwd = path.resolve(process.argv[1].split('node_modules')[0]);

function resolveTasks(tasks) {
    return tasks.map(task => {
        let ret = typeof task !== 'string' ? task : {
            type: 'common',
            command: task
        };

        ret.cwd = cwd;

        return ret;
    });
}

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

function checkConfig(config, hookName) {
    if (!config || !config.hooks) {
        return exitCode.SKIP_HOOK;
    }

    if (!isObject(config.hooks)) {
        return exitCode.HOOKS_INVALID;
    }

    let hookConfig = config.hooks[hookName];
    if (typeof hookConfig === 'undefined') {
        return exitCode.SKIP_HOOK;
    }

    if (!isObject(hookConfig)) {
        return exitCode.HOOK_CONFIG_INVALID;
    }

    let tasks = hookConfig.tasks;
    if (!Array.isArray(tasks)) {
        return exitCode.TASKS_INVALID;
    }

    for (let i = 0, len = tasks.length; i < len; i++) {
        // TODO: 校验没一项task的配置
    }
}

function getResolvedTasks([, , hookName]) {
    let config = getConfig();
    let checkRet = checkConfig(config, hookName);
    if (checkRet !== true) {
        return checkRet;
    }

    return resolveTasks(config.hooks[hookName].tasks);
}

getResolvedTasks.errorCode = errorCode;
getResolvedTasks.errorMsg = errorMsg;

module.exports = getResolvedTasks;
