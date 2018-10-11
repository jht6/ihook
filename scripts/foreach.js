'use strict';

const path = require('path');
const { execSync } = require('child_process');
const utils = require('../common/utils');

const {
    FOREACH_COMMAND_KEY,
    FOREACH_COMMAND_PARAM
} = require('../common/const')();

/**
 * Foreach runner constructor.
 * @param {Object} options Optional configuration, primarily used for testing.
 */
function ForeachRunner(options) {
    if (!new.target) {
        return new ForeachRunner();
    }

    this._OPT_ = options || {};
    this.filePathList = [];
    this.packageJsonDirPath = process.cwd();
    this.command = '';
}

ForeachRunner.prototype.run = function () {
    let gitStatus = utils.getGitStatus();
    if (!gitStatus) {
        utils.log([
            `There is nothing to commit,`,
            `Skipping running foreach.`
        ], 0);
    }

    this.filePathList = utils.getFilePathList(gitStatus);
    if (!this.filePathList.length) {
        utils.log([
            `There is nothing to traverse,`,
            `Skipping running foreach.`
        ], 0);
    }

    this.command = this.getCommandFromPackageJson();
    this.parsedCommand = this.parseCommand(this.command);
    this.traverse(this.filePathList, this.parsedCommand);
};

/**
 * Get the value of "pce-foreach-command" property from package.json.
 * @return {String} the value of "pce-foreach-command"
 */
ForeachRunner.prototype.getCommandFromPackageJson = function () {
    let json = null,
        command = '';
    try {
        json = utils.readPackageJson(path.join(
            utils.getPackageJsonDirPath(),
            'package.json'
        ));
    } catch (e) {
        utils.log([
            `Fail: Require json from package.json at ${this.packageJsonPath}`,
            `Skipping the hook, process will exit..`,
            `Error message is:`
        ]);
        console.log(e);
        process.exit(0);
    }

    if (json && json[FOREACH_COMMAND_KEY]) {
        command = json[FOREACH_COMMAND_KEY];
    }

    return command;
};

/**
 * Validate if the passed command is like "command-name [...] <filepath> [...]".
 * @param {String} command string of command
 * @return {Boolean} if the command is legal
 */
ForeachRunner.prototype.validateCommand = function (command) {
    const re = new RegExp(`^.*[\\w]+\\s+${FOREACH_COMMAND_PARAM}(\\s+.*)*$`);
    return re.test(command);
};

/**
 * Get parsed command from original command string.
 * @param {String} command original command string
 * @return {Object} an object contains info of command
 */
ForeachRunner.prototype.parseCommand = function (command) {
    if (!this.validateCommand(command)) {
        if (this._OPT_.isTesting) {
            return null;
        } else {
            utils.log([
                `Your "${FOREACH_COMMAND_KEY}" value is "${command}"`,
                `It's format is incorrect, please modify it in package.json. For example:`,
                `"echo ${FOREACH_COMMAND_PARAM}"`
            ], 1);
        }
    }

    command = command.trim().split(/\s+/);

    let args = command.slice(1);
    let ret = {
        cmd: command[0],
        args: args,
        paramIndex: args.indexOf(FOREACH_COMMAND_PARAM)
    };

    return ret;
};

/**
 * Traverse list of paths and execute command for each path.
 * @param {Array} pathList list of file paths
 * @param {Object} parsedCommand result of "parseCommand" method
 */
ForeachRunner.prototype.traverse = function (pathList, parsedCommand) {
    const { cmd, paramIndex } = parsedCommand;
    let args = parsedCommand.args.slice(0);
    let isPassed = true;
    pathList.forEach(filePath => {
        args[paramIndex] = filePath;

        try {
            execSync(
                `${cmd} ${args.join(' ')}`
            );
        } catch (e) {
            isPassed = false;
        }
    });

    if (!isPassed) {
        process.exit(1);
    }
};

// Expose the Hook instance so we can use it for testing purposes.
module.exports = ForeachRunner;

// Run only if this script is executed through CLI
if (require.main === module) {
    const foreachRunner = new ForeachRunner();
    foreachRunner.run();
}
