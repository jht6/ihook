
function transPathWinToUnix(path) {
    if (typeof path !== 'string') {
        throw Error('"absPath" should be a string!');
    }

    // If it is absolute path, add a leading "/"
    if (/^[A-Za-z]:/.test(path)) {
        path = '/' + path;
    }

    path = path
        .replace(/:/g, '')
        .replace(/[\\]+/g, '/');

    return path;
}

module.exports = transPathWinToUnix;
