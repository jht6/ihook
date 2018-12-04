

/**
 * Create a filter function according to task.filter config.
 * @param {Function|Array} filterConfig
 *  a filter function or an array contains file paths shaped like ['.eslintignore']
 */
module.exports = filterConfig => {
    let ret;
    if (typeof filterConfig === 'function') {
        ret = filterConfig;
    } else if (Array.isArray(filterConfig)) {
        // TODO: 通过['.eslintignore']这样的数组
    } else {
        ret = null;
    }

    return ret;
};
