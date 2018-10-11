'use strict';

const fs = require('fs');
const path = require('path');
const exists = fs.existsSync;
const { execSync } = require('child_process');
const utils = require('../common/utils');

const {
    BATCH_SCRIPT,
    BATCH_NAME
} = require('../common/const')();

function BatchInstaller() {
    if (!new.target) {
        return new BatchInstaller();
    }

    this.packageJsonPath = '';
    this.json = null;
}

BatchInstaller.prototype.run = function () {
    this.init();
    this.json = this.addBatchInScripts(this.json);
    this.json = utils.addPreCommitItem(this.json, BATCH_NAME);
    this.writeJsonToFile(this.json);
    this.copyBatchToPkgJsonDir();
};

BatchInstaller.prototype.init = function () {
    this.packageJsonPath = path.join(
        utils.getPackageJsonDirPath(),
        'package.json'
    );
    if (!exists(this.packageJsonPath)) {
        utils.log(`There is no "package.json" file in path: ${this.packageJsonPath}`, 1);
    }

    try {
        this.json = utils.readPackageJson(this.packageJsonPath);
    } catch (e) {
        utils.log([
            `Fail: Require json from package.json at ${this.packageJsonPath}`,
            `Error message is:`
        ]);
        console.log(e);
        process.exit(1);
    }

    if (!this.json) {
        this.json = {};
    }
    if (!this.json.scripts) {
        this.json.scripts = {};
    }
};

BatchInstaller.prototype.addBatchInScripts = function (json) {
    json.scripts[BATCH_NAME] = BATCH_SCRIPT;
    return json;
};

BatchInstaller.prototype.writeJsonToFile = function (json) {
    try {
        utils.modifyPackageJson(
            this.packageJsonPath,
            () => json
        );
        utils.log([
            `Success: Add "${BATCH_NAME}" in "scripts" of package.json`,
            `Success: Add "${BATCH_NAME}" in "pre-commit" of package.json`,
            `  at ${this.packageJsonPath}`
        ]);
    } catch (e) {
        utils.log([
            `Fail: Add property related to "batch" in package.json at ${this.packageJsonPath}`,
            `Error message is:`
        ]);
        console.log(e);
        process.exit(1);
    }
};

BatchInstaller.prototype.copyBatchToPkgJsonDir = function () {
    execSync(`cp ./node_modules/pre-commit-enhanced/scripts/batch-callback.js ./pce-batch-callback.js`);
    utils.log([
        `Success: Create "pce-batch-callback.js" besize the package.json.`,
        `  You should commit the "pce-batch-callback.js" file to your repository.`
    ]);
};

// Expose the Hook instance so we can use it for testing purposes.
module.exports = BatchInstaller;

// Run only if this script is executed through CLI
if (require.main === module) {
    const installer = new BatchInstaller();
    installer.run();
}

