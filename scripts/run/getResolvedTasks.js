
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

function _resolveTasks(tasks) {
    return tasks.map(task => {
        return typeof task !== 'string' ? task : {
            type: 'common',
            command: task
        };
    });
}

function getResolvedTasks([, , hookName]) {
    let config = getConfig();
    let hooks = config.hooks;
    if (!hooks) {
        return NO_HOOKS;
    }

    let hookConfig = hooks[hookName];
    if (!hookConfig) {
        return NO_HOOK_CONFIG;
    }

    let tasks = hookConfig.tasks;
    if (!tasks || !tasks.length) {
        return NO_TASKS;
    }

    return _resolveTasks(tasks);
}

getResolvedTasks.errorCode = errorCode;
getResolvedTasks.errorMsg = errorMsg;

module.exports = getResolvedTasks;
