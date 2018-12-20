const path = require('path');
const { getFilePathList } = require('..');

describe('can correctly execute the first filtering', () => {
    const testFlag = {
        isTesting: true,
        skipMapToAbsPath: true,
        skipFilterNotExist: true
    };

    test('can correctly filter paths', () => {
        const gitStatus = [
            `M  m.js\n`,
            `A  a.js\n`,
            `R  ro.js -> r.js\n`,
            `?? un.js\n`,
            ` M ea.js\n`,
            ` A ea.js\n`,
            ` D ed.js\n`
        ].join('');

        const list = getFilePathList(gitStatus, testFlag);
        expect(list.length > 0).toBe(true);
        expect(list[0]).toBe('m.js');
        expect(list[1]).toBe('a.js');
        expect(list[2]).toBe('r.js');
    });
});

test('can correctly map path to absolute path', () => {
    const gitRoot = '/test/gitroot/';
    const testFlag = {
        isTesting: true,
        gitRoot,
        skipFilterNotExist: true
    };
    const gitStatus = 'M  a.js\nA  b.js\nR  ro.js -> r.js\n';
    const list = getFilePathList(gitStatus, testFlag);
    expect(list.length).toBe(3);
    expect(list[0]).toBe(path.join(gitRoot, `a.js`));
    expect(list[1]).toBe(path.join(gitRoot, `b.js`));
    expect(list[2]).toBe(path.join(gitRoot, `r.js`));
});
