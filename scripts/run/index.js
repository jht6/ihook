'use strict';

const path = require('path');
const {
    getPackageJsonDirPath,
    readPackageJson
} = require('../../common/utils');

function getPkgJson() {
    let ret;
    try {
        ret = readPackageJson(
            path.join(getPackageJsonDirPath(), 'package.json')
        );
    } catch (e) {
        ret = null;
    }

    return ret;
}

console.log(getPkgJson());
