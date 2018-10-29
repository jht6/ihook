/**
 * Get path of "ihook" directory.
 */

const path = require('path');

function getIhookDirPath() {
    return path.join(__dirname, '../..');
}

module.exports = getIhookDirPath;
