'use strict';

const pleaseUpgradeNode = require('please-upgrade-node');
const pkg = require('../../package.json');
const fs = require('fs');
const path = require('path');
const exists = fs.existsSync;
const getHookShellCode = require('./getHookShellCode');
const utils = require('../../common/utils');
const log = utils.log;
const isInNestedNodeModules = utils.isInNestedNodeModules;
const getRealDotGitDirPath = utils.getRealDotGitDirPath;

// Check some condition before installing hooks.
function checkBeforeInstall() {
    // Node version isn't supported, skip install
    pleaseUpgradeNode(pkg, {
        exitCode: 0,
        message: function (requiredVersion) {
            return `ihook > ihook requires Node ${requiredVersion} , stop Git hooks installation.`;
        }
    });

    // Prevent installing hooks if ihook is in nested node_modules
    if (isInNestedNodeModules(__dirname)) {
        log('Trying to install in nested node_modules directory, stop Git hooks installation.', 0);
    }
}

function createHooks(hooksDirPath) {
    let hookNames = ['pre-commit'];
    let hookPaths = hookNames.map(name => path.resolve(hooksDirPath, name));
    hookPaths.forEach(path => {
        writeCodeToHook(path);
    });
}

// Write shell code to hook file
function writeCodeToHook(hookPath) {

    backupExistedHook(hookPath);

    let hookCode = getHookShellCode();
    if (!hookCode) {
        log('Failed to get hook code, stop Git hooks installation.', 0);
    }

    // It could be that we do not have rights to this folder which could cause the
    // installation of this module to completely fail. We should just output the
    // error instead destroying the whole npm install process.
    try {
        fs.writeFileSync(hookPath, hookCode);
    } catch (e) {
        log('Failed to create hook files in .git/hooks folder, error message is:');
        console.log(e.message);
    }

    try {
        fs.chmodSync(hookPath, '777');
    } catch (e) {
        log('Failed to chmod 777 for hook files, error message is:');
        console.log(e.message);
    }
}

// If there's an existing hook we want to back it up instead of
// overriding it and losing it completely as it might contain something
// important.
// If hook exists, move it to [hookName].old
function backupExistedHook(hookPath) {
    if (exists(hookPath) && !fs.lstatSync(hookPath).isSymbolicLink()) {
        fs.writeFileSync(hookPath + '.old', fs.readFileSync(hookPath));

        let hookName = path.basename(hookPath);
        log([
            `Detected an existing git "${hookName}" hook.`,
            `Old "${hookName}" hook backuped to ""${hookName}".old".`
        ]);
    }
}

function createConfig() {
    // TODO: 创建ihook.config.js
}

function install() {
    // Do some check. If not pass, exit process.
    checkBeforeInstall();

    // Bail out if we don't have an `.git` directory as the hooks will not get triggered.
    let dotGitDirPath = getRealDotGitDirPath();
    if (!dotGitDirPath) {
        log('Not found any .git folder, stop Git hooks installation.', 0);
    }

    // Create a hooks folder if it doesn't exist.
    let hooksDirPath = path.resolve(dotGitDirPath, 'hooks');
    if (!exists(hooksDirPath)) {
        fs.mkdirSync(hooksDirPath);
    }

    createHooks(hooksDirPath);
    createConfig();
}

install();
