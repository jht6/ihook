const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');
const { getGitRootDirPath } = require('..');

test('correctly find the this Git project\'s root dir', () => {
    let gitRootPath = getGitRootDirPath(
        path.resolve(__dirname)
    );
    let dotGitPath = path.join(gitRootPath, '.git');
    expect(fs.lstatSync(dotGitPath).isDirectory()).toBe(true);
});

test('correctly find dir which contains this file if there is ".git" file', () => {
    const dirName = 'tmpDir';
    const subDirName = 'subdir';
    execSync([
        `mkdir ${dirName}`,
        `cd ${dirName}`,
        `echo foo > .git`,
        `mkdir ${subDirName}`
    ].join(` && `));

    let gitRootPath = getGitRootDirPath(
        path.join(process.cwd(), `${dirName}/${subDirName}`)
    );
    let dotGitPath = path.join(gitRootPath, '.git');
    expect(fs.lstatSync(dotGitPath).isFile()).toBe(true);

    execSync([
        `rm -rf ${dirName}`
    ].join(` && `));
});

test('return "null" if it cannot find Git project\'s root dir', () => {
    let expectNull = getGitRootDirPath(
        path.resolve('..') // Start searching from the parent dir of Git project root dir
    );
    expect(expectNull).toBe(null);
});
