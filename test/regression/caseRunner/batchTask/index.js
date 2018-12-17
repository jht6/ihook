const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { TEST_DIR_NAME } = require('../../const');
const getConfigRelativePath = require('../getConfigRelativePath');

const batchDir = 'batch';

module.exports = () => {
    describe('batch task cases', () => {
        beforeAll(() => {
            execSync([
                `cd ${TEST_DIR_NAME}`,
                `echo batch/ignore/ > .testignore`,
                `mkdir ${batchDir}`,
                `cd ${batchDir}`,
                `touch index.js`,
                `mkdir ignore`,
                `cd ignore`,
                `touch a.js b.js`,
                `cd ..`,
                `mkdir notignore`,
                `cd notignore`,
                `touch a.js b.js`
            ].join(' && '));
        });

        test('run batch task and commit unsuccessfully', () => {
            let ok = true;

            try {
                execSync([
                    `cp ${getConfigRelativePath('configFail', __dirname)} ${TEST_DIR_NAME}/ihook.config.js`,
                    `cd ${TEST_DIR_NAME}/${batchDir}`,
                    `git add .`,
                    `git commit -m test_batch`
                ].join(' && '));
            } catch (e) {
                ok = false;
            }

            expect(ok).toBe(false);
            expect(fs.existsSync(
                path.join(process.cwd(), `${TEST_DIR_NAME}/flag_batch_task_fail`)
            )).toBe(true);
        });

        test('run batch task and commit successfully', () => {
            let ok = true;

            try {
                execSync([
                    `cp ${getConfigRelativePath('configSuccess', __dirname)} ${TEST_DIR_NAME}/ihook.config.js`,
                    `cd ${TEST_DIR_NAME}/${batchDir}`,
                    `git add .`,
                    `git commit -m test_batch`
                ].join(' && '));
            } catch (e) {
                ok = false;
            }

            expect(ok).toBe(true);
            expect(fs.existsSync(
                path.join(process.cwd(), `${TEST_DIR_NAME}/flag_batch_task_success`)
            )).toBe(true);
        });

        // TODO: 含filter的测试
    });
};
