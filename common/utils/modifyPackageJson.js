const fs = require('fs');

const readPackageJson = require('./readPackageJson');
const log = require('./log');

/**
 * Modify content of a package.json
 * @param {String} absPath absolute path of a package.json
 * @param {Function} callback A function will receive the json,
 *      and return the json after you change it.
 */
function modifyPackageJson(absPath, callback) {
    if (!fs.existsSync(absPath)) {
        return false;
    }

    let json = readPackageJson(absPath);
    if (!json) {
        json = {};
    }

    if (typeof callback === 'function') {
        json = callback(json);
    }

    if (Object.prototype.toString.call(json) !== '[object Object]') {
        throw Error('You must return an object in the callback.');
    }

    let indent = 2;
    try {
        fs.writeFileSync(
            absPath,
            JSON.stringify(json, null, indent) + '\n'
        );
    } catch (e) {
        log([
            `Fail: Add property related to "foreach" in package.json at ${absPath}`,
            `Error message is:`
        ]);
        console.log(e);
        process.exit(1);
    }

    return true;
}

module.exports = modifyPackageJson;
