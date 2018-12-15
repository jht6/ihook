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
    describe('common task from string config success', () => {
        let ok = true;

        beforeAll(() => {
            let file = 'test_common_str_task';

            try {
                execSync([
                    `cp ${getConfigRelativePath('configStrSuccess')} ${TEST_DIR_NAME}/ihook.config.js`,
                    `cd ${TEST_DIR_NAME}`,
                    `touch ${file}`,
                    `git add ${file}`,
                    `git commit -m test`
                ].join(' && '));
            } catch (e) {
                ok = false;
            }
        });

        test('run common task from string config and commit successly', () => {
            // 期望common_str_task_success文件存在
            expect(ok).toBe(true);
            expect(fs.existsSync(
                path.join(process.cwd(), `${TEST_DIR_NAME}/common_str_task_success`)
            )).toBe(true);
        });

        afterAll(() => {
            execSync(`rm ${TEST_DIR_NAME}/common_str_task_success`);
        });
    });

    // TODO: 用相同形式对其余3种config文件进行测试
};
