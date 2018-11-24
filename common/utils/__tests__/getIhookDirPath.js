const { getIhookDirPath } = require('..');

test('correctly return path of "ihook" directory', () => {
    let ihookDirPath = getIhookDirPath();
    expect(/ihook$/.test(ihookDirPath)).toBe(true);
});
