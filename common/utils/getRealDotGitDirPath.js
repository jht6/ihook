const getGitRootDirPath = require('./getGitRootDirPath');
const fs = require('fs');
const path = require('path');

/**
 * Get real .git directory.
 * If the first found ".git" is directory, result is it's path,
 * else is the path resolved from '.git' file.
 *
 * An git submodule example：
    /
    └── ihook
        ├── .git
        │   └── modules
        │       └── otherproject
        │           └── hooks
        └── otherproject
            └── .git (a file, it's content is "gitdir: ../.git/modules/otherproject")

    "/ihook/otherproject" is a submodule, and as a Git project, it is the root dir
     of Git project of "otherproject" too. And it is cwd when hook is executed.
 *
 * @param {String} startPath From where to start searching,
 *      if not set, it will be the parent directory of "ihook" directory,
 *      generally should be "node_modules" directroy.
 */
function getRealDotGitDirPath(startPath) {
    startPath = startPath && path.resolve(startPath) || path.join(__dirname, '../../..');

    const gitRootDirPath = getGitRootDirPath(startPath);
    if (!gitRootDirPath) {
        return null;
    }

    const dotGitPath = path.join(gitRootDirPath, '.git');
    const stats = fs.lstatSync(dotGitPath);
    // If it's a .git file, resolve real path from it's content
    if (stats.isFile()) {
        // Sample content is like "gitdir: pathToRealDotGitDir"
        // On Windows, pathToRealDotGitDir can contain ':',
        // for example "gitdir: ../.git/modules/dir:name"
        const dotGitFileContent = fs.readFileSync(dotGitPath, 'utf-8');
        const realDotGitDirPath = dotGitFileContent
            .split(':')
            .slice(1)
            .join(':')
            .trim();
        return path.resolve(gitRootDirPath, realDotGitDirPath);
    }
    // Else return path to .git directory
    return dotGitPath;
}

module.exports = getRealDotGitDirPath;
