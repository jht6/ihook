'use strict';

const pleaseUpgradeNode = require('please-upgrade-node');
const pkg = require('./package.json');
const fs = require('fs');
const path = require('path');
const os = require('os');
const jsEntryPath = path.join(__dirname, 'index.js');
const pkgDir = path.resolve(__dirname, '..', '..');
const exists = fs.existsSync;
const utils = require('./common/utils');
const log = utils.log;
const isInNestedNodeModules = utils.isInNestedNodeModules;
const modifyPackageJson = utils.modifyPackageJson;

checkBeforeInstall();

// Gather the location of the possible hidden .git directory, the hooks
// directory which contains all git hooks and the absolute location of the
// `pre-commit` file. The path needs to be absolute in order for the symlinking
// to work correctly.
let realGitRootPath = utils.getGitRootDirPath(pkgDir, true);
let dotGitDirPath;
if (realGitRootPath) {
    dotGitDirPath = path.join(realGitRootPath, '.git');
}

// Bail out if we don't have an `.git` directory as the hooks will not get triggered.
if (!dotGitDirPath) {
    log('Not found any .git folder for installing git hooks.', 0);
}

// Create a hooks folder if it doesn't exist.
let hooksDirPath = path.resolve(dotGitDirPath, 'hooks');
if (!exists(hooksDirPath)) {
    fs.mkdirSync(hooksDirPath);
}

// If there's an existing `pre-commit` hook we want to back it up instead of
// overriding it and losing it completely as it might contain something
// important.
let precommit = path.resolve(hooksDirPath, 'pre-commit');
writeCodeToHook(precommit);

addScriptToPkgJson();

// Check some condition before installing hooks.
function checkBeforeInstall() {
    // Node version isn't supported, skip install
    pleaseUpgradeNode(pkg, {
        exitCode: 0,
        message: function (requiredVersion) {
            return `ihook > ihook requires Node ${requiredVersion} , skipping Git hooks installation.`;
        }
    });

    // Prevent installing hooks if ihook is in nested node_modules
    if (isInNestedNodeModules(__dirname)) {
        log('Trying to install in nested node_modules directory, skipping Git hooks installation.', 0);
    }
}

// Write shell code to hook file
function writeCodeToHook(hookPath) {

    backupExistedHook(hookPath);

    // Maybe the "node_modules" directory isn't in the git root directory
    let jsEntryRelativeUnixPath = jsEntryPath.replace(realGitRootPath, '.');

    if (os.platform() === 'win32') {
        jsEntryRelativeUnixPath = jsEntryRelativeUnixPath.replace(/[\\/]+/g, '/');
    }

    let hookCode = [
        `#!/usr/bin/env bash`,
        ``,
        `hookName=\`basename "$0"\``,
        `node ${jsEntryRelativeUnixPath} $hookName`
    ].join('\n');

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

// add "install-pce-foreach" in "scripts" of package.json
function addScriptToPkgJson() {
    let packageJsonPath = path.join(utils.getPackageJsonDirPath(), 'package.json');
    let ok = modifyPackageJson(packageJsonPath, json => {
        if (!json) {
            json = {};
        }
        if (!json.scripts) {
            json.scripts = {};
        }

        json.scripts['pce-install-batch'] = 'node ./node_modules/ihook/scripts/install-batch.js';

        return json;
    });

    if (ok) {
        log([
            'Success: Add "pce-install-batch" scripts in package.json at ' + packageJsonPath
        ]);
    }
}
