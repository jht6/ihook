/**
 * Get hook's shell code.
 */

const path = require('path');
const os = require('os');
const { getGitRootDirPath } = require('../../common/utils/index');

const getJsEntryPath = () => path.join(__dirname, '../../index.js');
const render = ({ jsEntryRelativeUnixPath }) => `#!/bin/sh
hookName=\`basename "$0"\`
node ${jsEntryRelativeUnixPath} $hookName
`;

function getHookShellCode() {
    const startPath = path.resolve(__dirname, '..', '..');
    const gitRootDirPath = getGitRootDirPath(startPath);
    const jsEntryPath = getJsEntryPath();

    if (!gitRootDirPath) {
        return null;
    }

    let jsEntryRelativeUnixPath = path.relative(gitRootDirPath, jsEntryPath);
    if (os.platform() === 'win32') {
        jsEntryRelativeUnixPath = jsEntryRelativeUnixPath.replace(/[\\/]+/g, '/');
    }

    return render({ jsEntryRelativeUnixPath });
}

module.exports = getHookShellCode;
