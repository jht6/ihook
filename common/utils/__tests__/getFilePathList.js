const path = require('path');
const { getFilePathList } = require('..');

describe('can correctly execute the first filtering', () => {
    const testFlag = {
        isTesting: true,
        skipMapToAbsPath: true,
        skipFilterNotExist: true
    };

    test('can correctly filter empty string', () => {
        const gitStatus = [
            `MM a.js\n`,
            `A  b.js\n`,
            `?? c.js\n`,
            ` A d.js\n`,
            ` D e.js\n`
        ].join('');

        const list = getFilePathList(gitStatus, testFlag);
        expect(list.length > 0).toBe(true);

        const emptyList = list.filter(item => !item);
        expect(emptyList.length).toBe(0);
    });

    test('can correctly filter string starts with "??"', () => {
        let gitStatus = `?? a.js\n?? b.js\n`;
        let list = getFilePathList(gitStatus, testFlag);
        expect(list.length).toBe(0);

        gitStatus = `M  a.js\n?? b.js\n`;
        list = getFilePathList(gitStatus, testFlag);
        expect(list.length).toBe(1);
        expect(list[0]).toBe('M  a.js');
    });
});

test('can correctly map path to absolute path', () => {
    const gitRoot = '/test/gitroot/';
    const testFlag = {
        isTesting: true,
        gitRoot,
        skipFilterNotExist: true
    };
    const gitStatus = 'M  a.js\n A b.js\n';
    const list = getFilePathList(gitStatus, testFlag);
    expect(list.length).toBe(2);
    expect(list[0]).toBe(path.join(gitRoot, `a.js`));
    expect(list[1]).toBe(path.join(gitRoot, `b.js`));
});
