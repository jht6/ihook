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
        throw Error(`the param "absPath" (${absPath}) do not exist.`);
    }

    if (typeof callback !== 'function') {
        throw Error(`the param "callback" must be a function.`);
    }

    let json = readPackageJson(absPath);
    if (!json) {
        json = {};
    }

    json = callback(json);

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
            `Fail to modify the package.json at "${absPath}"`,
            `Error message is:`
        ]);
        console.log(e);

        // If cannot modify package.json successfully, the follow-up code
        //   maybe occur some error.
        // So exit process directly.
        process.exit(1);
    }

    return true;
}

module.exports = modifyPackageJson;
