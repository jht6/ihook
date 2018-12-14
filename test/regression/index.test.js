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



// Git commit and trigger hook.
// describe('regression - scripts/run/index.js(common hook)', () => {
//     let ok = true;
//     let commited = 'commited';

//     beforeAll(() => {
//         try {
//             execSync([
//                 `cd ${TEST_DIR_NAME}`,
//                 `echo foo >> ${commited}`,
//                 `git add ${commited}`,
//                 `git commit -m test`
//             ].join(` && `));
//         } catch (e) {
//             ok = false;
//         }
//     });

//     test('passed pre-commit hook and git commit successly', () => {
//         expect(ok).toBe(true);
//     });
// });
