const execa = require('execa');

/**
 * Batch task executor
 * @param {Object} task shaped like
 *  {
 *      type: 'batch',
 *      command: 'eslint <paths>',
 *      filter: () => true,
 *      useRelativePath: true
 *  }
 * @return {Number} exit code, if no error occurs, it's 0, else it's non-zero.
 */
module.exports = (task) => {
    const scriptPath = process.argv[1];
    const cwd = path.resolve(scriptPath.split('node_modules')[0]);

    let command = task.command;

    // TODO: 处理文件路径列表，构造命令的<paths>参数

    let exitCode = 0;

    // TODO: 执行batch命令，确定exitCode
    try {
        execa.shellSync(command, {
            cwd,
            stdio: 'inherit'
        });
    } catch (e) {
        exitCode = e.code || 1;
    }

    return exitCode;
};
