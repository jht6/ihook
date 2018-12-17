const path = require('path');

function getConfigRelativePath(filename, dirPath) {
    return path.relative(
        process.cwd(),
        path.join(dirPath, `${filename}.js`)
    );
}

module.exports = getConfigRelativePath;
