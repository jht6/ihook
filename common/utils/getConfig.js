const fs = require('fs');
const path = require('path');
const getPackageJsonDirPath = require('./getPackageJsonDirPath');
const readPackageJson = require('./readPackageJson');
const log = require('./log');
const {
    CONFIG_FILE_NAME
} = require('../../common/const')();

function getConfig() {
    let pkgJsonDirPath = getPackageJsonDirPath();
    let configPath = path.join(pkgJsonDirPath, CONFIG_FILE_NAME);
    if (!fs.existsSync(configPath)) {
        log(`"${CONFIG_FILE_NAME}" is not found, skipping hook.`, 0);
    }
    let config = readPackageJson(configPath);
    return config;
}

module.exports = getConfig;
