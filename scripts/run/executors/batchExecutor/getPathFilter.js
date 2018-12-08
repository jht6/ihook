const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

const {
    getPackageJsonDirPath,
    log
} = require('../../../../common/utils');

function createExtensionReg(exts) {
    exts = exts.map(ext => ext.slice(1)).join('|');
    return RegExp(`\\.(${exts})$`);
}

// TODO: 后续考虑在流程开始时对配置项进行一个完整的合法性检查
function checkExtensions(exts) {
    if (!exts || !Array.isArray(exts) || !exts.length) {
        log('"filter.extensions" should be an non-empty array, please check it');
        return false;
    }

    if (
        !exts.every(ext => ext.charAt(0) === '.')
    ) {
        log('Each item in "filter.extensions" should start with ".", please check it');
        return false;
    }

    return true;
}

function checkIgnoreRuleFilesExist(ignoreRuleFiles) {
    const pkgJsonDir = getPackageJsonDirPath();
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

function createFilterByConfig(config) {
    let extensions = config.extensions,
        ignoreRuleFiles = config.ignoreRuleFiles,
        extensionReg = null;

    if (checkExtensions(extensions)) {
        extensionReg = createExtensionReg(extensions);
    } else {
        process.exit(1);
    }

    // If no ignoreRuleFiles, only filter by extensions.
    if (!ignoreRuleFiles || !ignoreRuleFiles.length) {
        return filepath => extensionReg.test(filepath);
    }

    if (!checkIgnoreRuleFilesExist(ignoreRuleFiles)) {
        process.exit(1);
    }

    const pkgJsonDir = getPackageJsonDirPath();
    const ig = ignore();
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
module.exports = filterConfig => {
    let ret;
    if (typeof filterConfig === 'function') {
        ret = filterConfig;
    } else if (typeof filterConfig === 'object' && filterConfig !== null) {
        ret = createFilterByConfig(filterConfig);
    } else {
        ret = null;
    }

    return ret;
};
