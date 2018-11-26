/**
 * Get absolute path of directory which contains the 'package.json'.
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *                     IMPORTANT
 *  This function depends on this file's position.
 *  If this file is moved, notice to check the code.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const path = require('path');

function getPackageJsonDirPath() {
    return path.resolve(__dirname, '..', '..', '..', '..');
}

module.exports = getPackageJsonDirPath;
