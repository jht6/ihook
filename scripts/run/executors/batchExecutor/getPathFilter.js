const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

const {
    log
} = require('../../../../common/utils');

/**
 * Create a regular expression from an array contains extensions,
 * shaped like: ['.js']
 * @param {Array} exts array contains extensions
 */
function createExtensionReg(exts) {
    exts = exts.map(ext => ext.slice(1)).join('|');
    return RegExp(`\\.(${exts})$`);
}

/**
 * Check if all ignore rule files exist in package.json's dir
 * @param {Array} ignoreRuleFiles shaped like [".eslintignore", ".gitignore"]
 * @param {String} pkgJsonDir the dir which contains package.json
 */
function checkIgnoreRuleFilesExist(ignoreRuleFiles, pkgJsonDir) {
    let ret = true;
    ignoreRuleFiles.forEach(filename => {
        let filepath = path.join(pkgJsonDir, filename);
        if (
            !fs.existsSync(filepath) ||
            !fs.statSync(filepath).isFile()
        ) {
            log(`There is no "${filename}" file in ${pkgJsonDir}`);
            ret = false;
        }
    });

    return ret;
}

/**
 * Create filter function from a config object.
 * @param {Object} config a filter config object shaped like:
 * @param {Array} config.extensions an array contains extensions, shaped like: [".js"]
 * @param {Array} config.ignoreRuleFiles an array contains files, shaped like: [".eslintignore"]
 * @param {String} pkgJsonDir the dir which contains package.json
 */
function createFilterByConfig(config, pkgJsonDir) {
    let extensions = config.extensions,
        ignoreRuleFiles = config.ignoreRuleFiles,
        extensionReg = /[\s\S]*/;

    if (Array.isArray(extensions) && extensions.length) {
        extensionReg = createExtensionReg(extensions);
    }

    // If no ignoreRuleFiles, only filter by extensions.
    if (!ignoreRuleFiles || !ignoreRuleFiles.length) {
        return filepath => extensionReg.test(filepath);
    } else if (!checkIgnoreRuleFilesExist(ignoreRuleFiles, pkgJsonDir)) {
        return false;
    }

    const ig = ignore();
    // TODO: how to handle the baseDir?
    ignoreRuleFiles.forEach(filename => {
        ig.add(
            fs.readFileSync(
                path.join(pkgJsonDir, filename)
            ).toString()
        );
    });

    return filepath => extensionReg.test(filepath) && !ig.ignores(filepath);
}

/**
 * Create a filter function according to task.filter config.
 * @param {Function|Array} filterConfig
 *  a filter function or an object shaped like:
 *  {
 *      extensions: ['.js'],
 *      ignoreRuleFiles: ['.eslintignore']
 *  }
 */
module.exports = (filterConfig, pkgJsonDir) => {
    let ret;
    if (typeof filterConfig === 'function') {
        ret = filterConfig;
    } else if (typeof filterConfig === 'object' && filterConfig !== null) {
        ret = createFilterByConfig(filterConfig, pkgJsonDir);
    } else {
        ret = null;
    }

    return ret;
};

// Just for testing, don't use it outside.
module.exports.__tests__ = {
    createExtensionReg,
    checkIgnoreRuleFilesExist,
    createFilterByConfig
};
