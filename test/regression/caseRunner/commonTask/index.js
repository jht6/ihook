const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const { TEST_DIR_NAME } = require('../../const');

function getConfigRelativePath(filename) {
    return path.relative(
        process.cwd(),
        path.join(__dirname, `${filename}.js`)
    );
}

module.exports = () => {
    const cases = [
        {
            desc: 'run common task from string config and commit successly',
            committedFile: 'committed_common_str_task_success',
            configFile: 'configStrSuccess',
            taskFlagFile: 'flag_common_str_task_success',
            ok: true
        },
        {
            desc: 'run common task from string config and commit unsuccessfully',
            committedFile: 'committed_common_str_task_fail',
            configFile: 'configStrFail',
            taskFlagFile: 'flag_common_str_task_fail',
            ok: false
        },
        {
            desc: 'run common task from object config and commit successly',
            committedFile: 'committed_common_obj_task_success',
            configFile: 'configObjSuccess',
            taskFlagFile: 'flag_common_obj_task_success',
            ok: true
        },
        {
            desc: 'run common task from object config and commit unsuccessfully',
            committedFile: 'committed_common_obj_task_fail',
            configFile: 'configObjFail',
            taskFlagFile: 'flag_common_obj_task_fail',
            ok: false
        }
    ];

    describe('common task cases', () => {
        cases.forEach(item => {
            test(item.desc, () => {
                let ok = true;
                let committedFile = item.committedFile;

                try {
                    execSync([
                        `cp ${getConfigRelativePath(item.configFile)} ${TEST_DIR_NAME}/ihook.config.js`,
                        `cd ${TEST_DIR_NAME}`,
                        `touch ${committedFile}`,
                        `git add ${committedFile}`,
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
