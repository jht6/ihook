/**
 * Regression testing in a real scene.
 */

const { execSync } = require('child_process');

const {
    CONFIG_FILE_NAME
} = require('../../common/const')();
const beforeTest = require('./beforeTest');
const caseRunner = require('./caseRunner');

const { TEST_DIR_NAME } = require('./const');

beforeAll(() => {
    beforeTest(TEST_DIR_NAME);
});

caseRunner();

afterAll(() => {
    if (typeof __SAVE_SANDBOX__ === 'undefined') {
        execSync(`rm -rf ${TEST_DIR_NAME}`);
    }
});
