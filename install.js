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
let hooks = path.resolve(dotGitDirPath, 'hooks');
if (!exists(hooks)) {
    fs.mkdirSync(hooks);
}

// If there's an existing `pre-commit` hook we want to back it up instead of
// overriding it and losing it completely as it might contain something
// important.
let precommit = path.resolve(hooks, 'pre-commit');
if (exists(precommit) && !fs.lstatSync(precommit).isSymbolicLink()) {
    fs.writeFileSync(precommit + '.old', fs.readFileSync(precommit));
    log([
        'Detected an existing git pre-commit hook.',
        'ihook: Old pre-commit hook backuped to "pre-commit.old".'
    ]);
}

// We cannot create a symlink over an existing file so make sure it's gone and
// finish the installation process.
try {
    fs.unlinkSync(precommit);
} catch (e) { /* do nothing */ }

// Maybe the "node_modules" directory isn't in the git root directory
let jsEntryRelativeUnixPath = jsEntryPath.replace(realGitRootPath, '.');

if (os.platform() === 'win32') {
    jsEntryRelativeUnixPath = jsEntryRelativeUnixPath.replace(/[\\/]+/g, '/');
}

let precommitContent = `#!/usr/bin/env bash

hookName=\`basename "$0"\`
node ${jsEntryRelativeUnixPath} $hookName
`;

// It could be that we do not have rights to this folder which could cause the
// installation of this module to completely fail. We should just output the
// error instead destroying the whole npm install process.
try {
    fs.writeFileSync(precommit, precommitContent);
} catch (e) {
    log('Failed to create hook files in .git/hooks folder, error message is:');
    console.log(e.message);
}

try {
    fs.chmodSync(precommit, '777');
} catch (e) {
    log('Failed to chmod 777 for hook files, error message is:');
    console.log(e.message);
}

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
