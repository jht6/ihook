
const { readPackageJson } = require('..');
const { execSync } = require('child_process');
const path = require('path');

// 根据当前文件路径加密生成hash，取前面6位作为文件名
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
hash.update(__filename);
const filename = hash.digest('hex').slice(0, 6) + '.json';

const filepath = path.join(__dirname, filename);

// 执行每个用例时，切换到当前文件的目录，执行完之后在切回到工作目录
const oldCwd = process.cwd();
beforeEach(() => {
    process.chdir(__dirname);
});

afterEach(() => {
    process.chdir(oldCwd);
});

test('throw an exception if the file "absPath" points to does not exist', () => {
    let hasException = false;
    try {
        readPackageJson(
            path.join(__dirname, './not_exsit.json')
        );
    } catch (e) {
        hasException = true;
    }

    expect(hasException).toBe(true);
});

test('return null if the file\'s content cannot be parsed', () => {
    execSync(`echo foo > ${filename}`);

    let ret = readPackageJson(filepath);
    expect(ret).toBe(null);

    execSync(`rm -f ${filename}`);
});

test('read json from a file successly', function () {
    execSync(`echo {"name":"oj"} > ${filename}`);

    let ret = readPackageJson(filepath);
    expect(typeof ret).toBe('object');
    expect(ret.name).toBe('oj');

    execSync(`rm -f ${filename}`);
});
