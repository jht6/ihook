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
const modifyPackageJson = utils.modifyPackageJson;

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
        log('Failed to get hook code, skip installing.', 0);
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

function install() {

    checkBeforeInstall();

    const pkgDirPath = path.resolve(__dirname, '..', '..');
    const gitRootDirPath = utils.getGitRootDirPath(pkgDirPath, true);
    let dotGitDirPath;
    if (gitRootDirPath) {
        dotGitDirPath = path.join(gitRootDirPath, '.git');
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

    createHooks(hooksDirPath);
    addScriptToPkgJson();
}

install();
