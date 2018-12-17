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
                `touch a.js b.ts c.css`,
                `cd ..`,
                `mkdir notignore`,
                `cd notignore`,
                `touch a.js b.ts c.css`
            ].join(' && '));
        });

        const cases = [
            {
                desc: 'run batch task and commit unsuccessfully',
                configFile: 'configFail',
                taskFlagFile: 'flag_batch_task_fail',
                ok: false
            },
            {
                desc: 'run batch task and commit successfully',
                configFile: 'configSuccess',
                taskFlagFile: 'flag_batch_task_success',
                ok: true
            },
            {
                desc: 'run batch task with filter(function) and commit successfully',
                configFile: 'configFnFilterSuccess',
                taskFlagFile: 'flag_batch_task_fn_filter_success',
                ok: true
            },
            {
                desc: 'run batch task with filter(object) and commit successfully',
                configFile: 'configObjFilterSuccess',
                taskFlagFile: 'flag_batch_task_obj_filter_success',
                ok: true
            }
        ];
        const shouldResetStartIndex = 1;

        cases.forEach((item, index) => {
            test(item.desc, () => {
                if (index > shouldResetStartIndex) {
                    execSync([
                        `cd ${TEST_DIR_NAME}`,
                        `git reset HEAD~1` // 'git reset HEAD^' is ineffective here, so use 'git reset HEAD~1'
                    ].join(' && '));
                }

                let ok = true;

                try {
                    execSync([
                        `cp ${getConfigRelativePath(item.configFile, __dirname)} ${TEST_DIR_NAME}/ihook.config.js`,
                        `cd ${TEST_DIR_NAME}/${batchDir}`,
                        `git add .`,
                        `git commit -m test`
                    ].join(' && '));
                } catch (e) {
                    ok = false;
                }

                expect(ok).toBe(item.ok);
                expect(fs.existsSync(
                    path.join(process.cwd(), `${TEST_DIR_NAME}/${item.taskFlagFile}`)
                )).toBe(true);
            });
        });
    });
};
