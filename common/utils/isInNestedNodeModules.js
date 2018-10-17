/**
 * This prevents the case where someone would want to debug a node_module that has
 * ihook as devDependency and run npm install from node_modules directory
 * @param {String} ihookDir absolute path of ihook's dir
 * @return {Boolean}
 */
function isInNestedNodeModules(ihookDir) {
    // INIT_CWD holds the full path you were in when you ran npm install (supported also by yarn and pnpm)
    // See https://docs.npmjs.com/cli/run-script
    if (process.env.INIT_CWD) {
        return process.env.INIT_CWD.indexOf('node_modules') !== -1;
    }

    // Old technique
    return (ihookDir.match(/node_modules/g) || []).length > 1;
}

module.exports = isInNestedNodeModules;
