'use strict';

const fs = require('fs');
const path = require('path');
const exists = fs.existsSync;
const utils = require('../common/utils');

const {
    FOREACH_COMMAND_TPL,
    FOREACH_COMMAND_KEY,
    FOREACH_SCRIPT,
    FOREACH_NAME
} = require('../common/const')();

function ForeachInstaller() {
    if (!new.target) {
        return new ForeachInstaller();
    }

    this.packageJsonPath = '';
    this.json = null;
}

ForeachInstaller.prototype.run = function () {
    this.init();
    this.json = this.addForeachInScripts(this.json);
    this.json = utils.addPreCommitItem(this.json, FOREACH_NAME);
    this.json = this.addForeachCommand(this.json);
    this.writeJsonToFile(this.json);
};

ForeachInstaller.prototype.init = function () {
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

ForeachInstaller.prototype.addForeachInScripts = function (json) {
    json.scripts[FOREACH_NAME] = FOREACH_SCRIPT;

    return json;
};

ForeachInstaller.prototype.addForeachCommand = function (json) {
    json[FOREACH_COMMAND_KEY] = FOREACH_COMMAND_TPL;
    return json;
};

ForeachInstaller.prototype.writeJsonToFile = function (json) {
    try {
        utils.modifyPackageJson(
            this.packageJsonPath,
            () => json
        );
        utils.log([
            `Success: Add "${FOREACH_NAME}" in "scripts" of package.json`,
            `Success: Add "${FOREACH_NAME}" in "pre-commit" of package.json`,
            `Success: Add "${FOREACH_COMMAND_KEY}" in package.json`,
            `    at ${this.packageJsonPath}`
        ]);
    } catch (e) {
        utils.log([
            `Fail: Add property related to "foreach" in package.json at ${this.packageJsonPath}`,
            `Error message is:`
        ]);
        console.log(e);
        process.exit(1);
    }
};

// Expose the Hook instance so we can use it for testing purposes.
module.exports = ForeachInstaller;

// Run only if this script is executed through CLI
if (require.main === module) {
    const installer = new ForeachInstaller();
    installer.run();
}
