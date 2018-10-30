const getGitRootDirPath = require('./getGitRootDirPath');
const fs = require('fs');
const path = require('path');

function getRealDotGitDirPath() {
    const dotGitPath = getGitRootDirPath(path.join(__dirname, '../../..'));
    if (dotGitPath) {
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
            return path.resolve(path.dirname(dotGitPath), realDotGitDirPath);
        }
        // Else return path to .git directory
        return dotGitPath;
    }
    return null;
}

module.exports = getRealDotGitDirPath;
