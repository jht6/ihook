/**
 * Regression testing in a real scene.
 */

const fs = require('fs');
const { execSync } = require('child_process');

const {
    CONFIG_FILE_NAME
} = require('../../common/const')();
const beforeTest = require('./beforeTest');

const TEST_DIR_NAME = 'sandbox';

beforeAll(() => {
    beforeTest(TEST_DIR_NAME);
});

afterAll(() => {
    if (typeof __SAVE_SANDBOX__ === 'undefined') {
        execSync(`rm -rf ${TEST_DIR_NAME}`);
    }
});

// Run install.js.
describe('regression - install.js', () => {
    let ok = true;

    beforeAll(() => {
        try {
            execSync([
                `cd ${TEST_DIR_NAME}`,
                `node ./node_modules/ihook/scripts/install/index.js`
            ].join(` && `));
        } catch (e) {
            ok = false;
        }
    });

    test('run install.js without errors', () => {
        expect(ok).toBe(true);
    });

    // TODO: other hooks except "pre-commit"
    test('install "pre-commit" hook file in .git/hooks', () => {
        expect(
            fs.existsSync(`./${TEST_DIR_NAME}/.git/hooks/pre-commit`)
        ).toBe(true);
    });

    test(`copy "${CONFIG_FILE_NAME}" to "package.json"\'s dir`, () => {
        expect(
            fs.existsSync(`./${TEST_DIR_NAME}/${CONFIG_FILE_NAME}`)
        ).toBe(true);
    });
});

// Git commit and trigger hook.
describe('regression - scripts/run/index.js(common hook)', () => {
    let ok = true;
    let commited = 'commited';

    beforeAll(() => {
        try {
            execSync([
                `cd ${TEST_DIR_NAME}`,
                `echo foo >> ${commited}`,
                `git add ${commited}`,
                `git commit -m test`
            ].join(` && `));
        } catch (e) {
            ok = false;
        }
    });

    test('passed pre-commit hook and git commit successly', () => {
        expect(ok).toBe(true);
    });
});
