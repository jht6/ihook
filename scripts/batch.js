'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const {
    getGitStatus,
    getFilePathList,
    getPackageJsonDirPath,
    transPathWinToUnix,
    log
} = require('../common/utils/index');

const callbackPath = path.join(
    path.resolve(__dirname, '../../..'),
    'pce-batch-callback.js'
);

let callbacks;
if (fs.existsSync(callbackPath)) {
    callbacks = require(callbackPath);
} else {
    log('Can\'n find "pce-batch-callback.js", skip hook.', 0);
}

const PKG_JSON_DIR_PATH_UNIX = transPathWinToUnix(getPackageJsonDirPath());

let pathList = getFilePathList(getGitStatus());

if (!pathList.length) {
    log('There is no file to be commited, skip hook.', 0);
}

// Transform all paths to Unix format.
// For example: 'C:\\a\\b' -> '/C/a/b'.
pathList = pathList.map(transPathWinToUnix);

// If useRelativePath() return true, transform absolute paths to relative paths.
if (typeof callbacks.useRelativePath === 'function') {
    if (callbacks.useRelativePath()) {
        pathList = pathList.map(
            item => item.replace(PKG_JSON_DIR_PATH_UNIX, '.')
        );
    }
}

// Filter paths by "filter" callback function.
if (typeof callbacks.filter === 'function') {
    pathList = pathList.filter(callbacks.filter);
}

if (!pathList.length) {
    log('There is no file path after filtering, skip hook.', 0);
}

// Get command and replace param.
let cmd = callbacks.command();
cmd = cmd.replace('<paths>', pathList.join(' '));

// Execute command.
let isPassed = true;
try {
    execSync(cmd, {
        stdio: [0, 1, 2]
    });
} catch (e) {
    isPassed = false;
}

if (!isPassed) {
    process.exit(1);
}
