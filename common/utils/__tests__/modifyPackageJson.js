const path = require('path');
const { execSync } = require('child_process');
const {
    modifyPackageJson,
    readPackageJson
} = require('..');

const oriCwd = process.cwd();

beforeEach(() => {
    process.chdir(__dirname);
});

afterEach(() => {
    process.chdir(oriCwd);
});

test('throw an exception if the file "absPath" points to does not exist', () => {
    let hasException = false;
    try {
        modifyPackageJson(path.join(__dirname, 'not_exsit.json'));
    } catch (e) {
        hasException = true;
    }

    expect(hasException).toBe(true);
});

test('callback will receive an empty object if the file is empty', () => {
    let filename = 'modifyPackageJsonTmp1.json';
    let filepath = path.join(__dirname, filename);

    execSync([
        `touch ${filename}`
    ].join(` && `));

    let ret = modifyPackageJson(filepath, json => json);
    let json = readPackageJson(filepath);

    expect(ret).toBe(true);
    expect(JSON.stringify(json)).toBe('{}');

    execSync([
        `rm -f ${filename}`
    ].join(` && `));
});

test('throw an exception if the callback return a non-object value', () => {
    let filename = 'modifyPackageJsonTmp2.json';
    let filepath = path.join(__dirname, filename);

    execSync([
        `touch ${filename}`
    ].join(` && `));

    let hasException = false;
    try {
        modifyPackageJson(
            filepath,
            () => null
        );
    } catch (e) {
        hasException = true;
    }

    expect(hasException).toBe(true);

    execSync([
        `rm -f ${filename}`
    ].join(` && `));
});

test('correctly save value to the file', () => {
    let filename = 'modifyPackageJsonTmp3.json';
    let filepath = path.join(__dirname, filename);

    execSync([
        `touch ${filename}`
    ].join(` && `));

    let ret = modifyPackageJson(
        filepath,
        () => ({foo: 'iLoveTSY'})
    );
    let json = readPackageJson(filepath);

    expect(ret).toBe(true);
    expect(json.foo).toBe('iLoveTSY');

    execSync([
        `rm -f ${filename}`
    ].join(` && `));
});
