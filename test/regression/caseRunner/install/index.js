const fs = require('fs');
const { execSync } = require('child_process');

const { CONFIG_FILE_NAME } = require('../../../../common/const')();
const { TEST_DIR_NAME } = require('../../const');

module.exports = () => {
    // Run install.js
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

    describe('regression - install again', () => {
        beforeAll(() => {
            execSync([
                `cd ${TEST_DIR_NAME}`,
                `echo i_love_tsy> ${CONFIG_FILE_NAME}`,
                `node ./node_modules/ihook/scripts/install/index.js`
            ].join(` && `));
        });

        test(`don't copy "${CONFIG_FILE_NAME}" if it already exists`, () => {
            expect(
                fs.existsSync(`./${TEST_DIR_NAME}/${CONFIG_FILE_NAME}`)
            ).toBe(true);
            expect(
                // to get rid of EOL, we only compare the first ten chars here
                fs.readFileSync(`./${TEST_DIR_NAME}/${CONFIG_FILE_NAME}`).toString().slice(0, 10)
            ).toBe(`i_love_tsy`);
        });
    });
};
