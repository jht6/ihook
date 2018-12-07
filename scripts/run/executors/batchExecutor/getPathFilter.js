

/**
 * Create a filter function according to task.filter config.
 * @param {Function|Array} filterConfig
 *  a filter function or an object shaped like:
 *  {
 *      extensions: ['.js'],
 *      ignoreRuleFiles: ['.eslintignore']
 *  }
 */
module.exports = filterConfig => {
    let ret;
    if (typeof filterConfig === 'function') {
        ret = filterConfig;
    } else if (typeof filterConfig === 'object' && filterConfig !== null) {
        // TODO: 通过extensions和ignoreRuleFiles创建一个过滤函数
    } else {
        ret = null;
    }

    return ret;
};
