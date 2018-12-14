const { BATCH_CMD_PARAM_TOKEN } = require('../../../common/const')();
const codes = require('./codes');

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function checkConfig(config, hookName) {
    if (!config || !config.hooks) {
        return codes.SKIP_HOOK;
    }

    if (!isObject(config.hooks)) {
        return codes.HOOKS_INVALID;
    }

    let hookConfig = config.hooks[hookName];
    if (typeof hookConfig === 'undefined') {
        return codes.SKIP_HOOK;
    }

    if (!isObject(hookConfig)) {
        return codes.HOOK_CONFIG_INVALID;
    }

    let tasks = hookConfig.tasks;
    if (!Array.isArray(tasks)) {
        return codes.TASKS_INVALID;
    }

    for (let i = 0, len = tasks.length; i < len; i++) {
        let task = tasks[i];
        if (typeof task !== 'string' && !isObject(task)) {
            return codes.TASK_ITEM_TYPE_INVALID;
        }

        if (isObject(task)) {
            if (!task.type) {
                return codes.TASK_ITEM_LACK_TYPE;
            }

            if (!task.command) {
                return codes.TASK_ITEM_LACK_COMMAND;
            }

            if (task.type === 'batch') {
                if (task.command.indexOf(BATCH_CMD_PARAM_TOKEN) === -1) {
                    return codes.TASK_ITEM_BATCH_COMMAND_NO_PARAM;
                }

                let filter = task.filter;
                if (
                    typeof filter !== 'undefined' &&
                    (typeof filter !== 'function' && !isObject(filter))
                ) {
                    return codes.TASK_ITEM_FILTER_TYPE_INVALID;
                }

                if (isObject(filter)) {
                    let ignoreRuleFiles = filter.ignoreRuleFiles;
                    if (
                        typeof ignoreRuleFiles !== 'undefined' &&
                        !Array.isArray(ignoreRuleFiles)
                    ) {
                        return codes.TASK_ITEM_FILTER_IGNORERULEFILES_TYPE_INVALID;
                    }

                    let extensions = filter.extensions;
                    if (
                        typeof extensions !== 'undefined' &&
                        !Array.isArray(extensions)
                    ) {
                        return codes.TASK_ITEM_FILTER_EXTENSIONS_TYPE_INVALID;
                    }

                    if (!extensions.every(ext => ext.charAt(0) === '.')) {
                        return codes.TASK_ITEM_FILTER_EXTENSIONS_FORMAT_INVALID;
                    }
                }
            }
        }
    }

    return true;
}
