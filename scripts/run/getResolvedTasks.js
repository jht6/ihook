const path = require('path');
const {
    getConfig
} = require('../../common/utils');
const {
    CONFIG_FILE_NAME
} = require('../../common/const');
const checkConfig = require('./checkConfig');

// const errorMsg = {
//     [exitCode.NO_HOOKS]: `Your config hasn't "hooks" property, please check "${CONFIG_FILE_NAME}"`,
//     [exitCode.NO_TASKS]: `Your config hasn't "tasks" property in "${process.argv[2]}", please check "${CONFIG_FILE_NAME}`
// };

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
    let checkRet = checkConfig(config, hookName);
    if (checkRet !== true) {
        return checkRet;
    }

    return resolveTasks(config.hooks[hookName].tasks);
}

module.exports = getResolvedTasks;
