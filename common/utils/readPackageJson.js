const fs = require('fs');

/**
 * 从指定的package.json文件中读出内容并转为数据
 * @param {String} absPath 要读取的package.json文件的绝对路径
 * @return {Object} parse后的数据
 */
function readPackageJson(absPath) {
    let ret = null;

    if (!fs.existsSync(absPath)) {
        throw Error(`${absPath} doesn't exist!`);
    }

    try {
        ret = JSON.parse(fs.readFileSync(absPath).toString());
    } catch (e) {/* do nothing */}

    return ret;
}

module.exports = readPackageJson;
