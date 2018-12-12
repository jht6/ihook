const path = require('path');
const {
    getConfig
} = require('../../common/utils');
const {
    CONFIG_FILE_NAME
} = require('../../common/const');

const errorCode = {
    NO_HOOKS: 'noHooks',
    NO_HOOK_CONFIG: 'noHookConfig',
    NO_TASKS: 'noTasks'
};
const errorMsg = {
    [errorCode.NO_HOOKS]: `Your config hasn't "hooks" property, please check "${CONFIG_FILE_NAME}"`,
    [errorCode.NO_TASKS]: `Your config hasn't "tasks" property in "${process.argv[2]}", please check "${CONFIG_FILE_NAME}`
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

function getResolvedTasks([, , hookName]) {
    let config = getConfig();
    let hooks = config.hooks;
    if (!hooks) {
        return errorCode.NO_HOOKS;
    }

    let hookConfig = hooks[hookName];
    if (!hookConfig) {
        return errorCode.NO_HOOK_CONFIG;
    }

    let tasks = hookConfig.tasks;
    if (!tasks || !tasks.length) {
        return errorCode.NO_TASKS;
    }

    return resolveTasks(tasks);
}

getResolvedTasks.errorCode = errorCode;
getResolvedTasks.errorMsg = errorMsg;

module.exports = getResolvedTasks;
