const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const getPathFilter = require('../getPathFilter');
const {
    createExtensionReg,
    checkExtensions,
    checkIgnoreRuleFilesExist,
    createFilterByConfig
} = getPathFilter.__tests__;

describe('#createExtensionReg', () => {
    test('the regExp created from [".js"]', () => {
        const re = createExtensionReg(['.js']);
        expect(re.test('pre/a.js')).toBe(true);
        expect(re.test('pre/b.ts')).toBe(false);
        expect(re.test('pre/c.s')).toBe(false);
        expect(re.test('pre/d.jsx')).toBe(false);
        expect(re.test('pre/ejs')).toBe(false);
        expect(re.test('pre/f.js.x')).toBe(false);
    });

    test('the regExp created from [".js", ".ts"]', () => {
        const re = createExtensionReg(['.js', '.ts']);
        expect(re.test('pre/a.js')).toBe(true);
        expect(re.test('pre/b.ts')).toBe(true);
        expect(re.test('pre/c.s')).toBe(false);
        expect(re.test('pre/d.jsx')).toBe(false);
        expect(re.test('pre/ejs')).toBe(false);
        expect(re.test('pre/f.js.x')).toBe(false);
        expect(re.test('pre/f.jsts')).toBe(false);
    });
});

test('#checkExtensions', () => {
    const cases = [
        [ null, true ],
        [ {}, true ],
        [ 'abc', true ],
        [ [], true ],
        [ ['.js', 'ts'], false ],
        [ ['.js'], true ],
        [ ['.js', '.ts'], true ]
    ];

    cases.forEach(item => {
        if (checkExtensions(item[0]) !== item[1]) {
            console.log(item[0]);
        }
        expect(checkExtensions(item[0])).toBe(item[1]);
    });
});

describe('#checkIgnoreRuleFilesExist', () => {
    const eslintIgnore = '.eslintignore';
    const gitIgnore = '.gitignore';
    const noSuchFile = 'nosuchfile';
    const mockPkgJsonDir = __dirname;

    // create files for testing
    beforeAll(() => {
        execSync([
            `cd ${__dirname}`,
            `touch ${eslintIgnore}`,
            `touch ${gitIgnore}`
        ].join(` && `));
    });

    const cases = [
        [ [eslintIgnore], true ],
        [ [eslintIgnore, gitIgnore], true ],
        [ [eslintIgnore, gitIgnore, noSuchFile], false ],
        [ [noSuchFile], false ]
    ];

    test('checkIgnoreRuleFilesExist', () => {
        cases.forEach(item => {
            expect(
                checkIgnoreRuleFilesExist(item[0], mockPkgJsonDir)
            ).toBe(item[1]);
        });
    });

    // remove files for testing
    afterAll(() => {
        execSync([
            `cd ${__dirname}`,
            `rm ${eslintIgnore}`,
            `rm ${gitIgnore}`
        ].join(` && `));
    });
});

describe('#createFilterByConfig', () => {
    const ignore1 = 'ignore_1';
    const ignore2 = 'ignore_2';
    const ignoreRule1 = [
        'ignore_1_a/',
        'ignore_1_b/*',
        '!ignore_1_b/notignore/'
    ].join('\n') + '\n';
    const ignoreRule2 = 'ignore_2_a/*.ts\n';

    // create ignore rule files for testing
    beforeAll(() => {
        execSync([
            `cd ${__dirname}`,
            `touch ${ignore1}`,
            `touch ${ignore2}`
        ].join(` && `));

        fs.writeFileSync(
            path.join(__dirname, ignore1),
            ignoreRule1
        );

        fs.writeFileSync(
            path.join(__dirname, ignore2),
            ignoreRule2
        );
    });

    const cases = [
        [ 'ignore_1_a/a.js', false ],
        [ 'ignore_1_a/a.css', false ],
        [ 'ignore_1_aa/aa.js', true ],
        [ 'ignore_1_aa/aa.ts', true ],
        [ 'ignore_1_aa/aa.jsx', true ],
        [ 'ignore_1_aa/aa.css', false ],
        [ 'ignore_1_b/b.js', false ],
        [ 'ignore_1_b/notignore/b.js', true ],
        [ 'ignore_1_b/notignore/b.jsx', true ],
        [ 'ignore_1_b/notignore/b.css', false ],
        [ 'ignore_2_a/a.js', true ],
        [ 'ignore_2_a/a.jsx', true ],
        [ 'ignore_2_a/a.ts', false ]
    ];

    test('createFilterByConfig', () => {
        const filter = createFilterByConfig({
            extensions: ['.js', '.jsx', '.ts'],
            ignoreRuleFiles: [ignore1, ignore2]
        }, __dirname);

        const filteredList = cases.map(item => item[0]).filter(filter);

        cases.forEach(item => {
            expect(filteredList.includes(item[0])).toBe(item[1]);
        });
    });

    // remove files for testing
    afterAll(() => {
        execSync([
            `cd ${__dirname}`,
            `rm ${ignore1}`,
            `rm ${ignore2}`
        ].join(` && `));
    });
});

describe('#getPathFilter', () => {
    const eslintIgnore = '.eslintignore';
    const gitIgnore = '.gitignore';
    const eslintIngoreRule = 'ignore1\nignore2\n';
    const gitIgnoreRule = 'ignore3\n';

    // create ignore rule files for testing
    beforeAll(() => {
        execSync([
            `cd ${__dirname}`,
            `touch ${eslintIgnore}`,
            `touch ${gitIgnore}`
        ].join(` && `));

        fs.writeFileSync(
            path.join(__dirname, eslintIgnore),
            eslintIngoreRule
        );

        fs.writeFileSync(
            path.join(__dirname, gitIgnore),
            gitIgnoreRule
        );
    });

    const cases = [
        [ 'ignore1/a.js', false ],
        [ 'ignore2/a.jsx', false ],
        [ 'ignore3/a.ts', false ],
        [ 'notignore/a.js', true ],
        [ 'notignore/a.jsx', true ],
        [ 'notignore/a.ts', false ]
    ];

    test('get a filter that does not exclude anything', () => {
        const filter = getPathFilter(() => true);
        expect(typeof filter).toBe('function');

        const filteredList = cases.map(item => item[0]).filter(filter);
        expect(filteredList.length).toBe(cases.length);
    });

    test('get a filter that only retains .js file', () => {
        const filter = getPathFilter(filepath => /\.js$/.test(filepath));
        expect(typeof filter).toBe('function');

        const filteredList = cases.map(item => item[0]).filter(filter);
        expect(filteredList.length).toBe(2);
        expect(filteredList.every(filepath => filepath.split('.')[1] === 'js'));
    });

    test('get null if pass invalid param', () => {
        const filter = getPathFilter(null);
        expect(filter).toBe(null);
    });

    test('get a filter from a config object', () => {
        const filter = getPathFilter({
            extensions: ['.js', '.jsx'],
            ignoreRuleFiles: [eslintIgnore, gitIgnore]
        }, __dirname);
        expect(typeof filter).toBe('function');

        const filteredList = cases.map(item => item[0]).filter(filter);
        cases.forEach(item => {
            expect(filteredList.includes(item[0])).toBe(item[1]);
        });
    });

    // remove files for testing
    afterAll(() => {
        execSync([
            `cd ${__dirname}`,
            `rm ${eslintIgnore}`,
            `rm ${gitIgnore}`
        ].join(` && `));
    });
});
