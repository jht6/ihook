const { transPathWinToUnix } = require('..');

test(`".\\\\a\\\\b" -> "./a/b"`, () => {
    expect(
        transPathWinToUnix('.\\\\a\\\\b')
    ).toBe('./a/b');
});

test(`".\\a\\b" -> "./a/b"`, () => {
    expect(
        transPathWinToUnix('.\\a\\b')
    ).toBe('./a/b');
});

test(`"./a/b" -> "./a/b"`, () => {
    expect(
        transPathWinToUnix('./a/b')
    ).toBe('./a/b');
});

test(`"a/b/c" -> "a/b/c"`, () => {
    expect(
        transPathWinToUnix('a/b/c')
    ).toBe('a/b/c');
});

test(`"a\\b\\c" -> "a/b/c"`, () => {
    expect(
        transPathWinToUnix('a\\b\\c')
    ).toBe('a/b/c');
});

test(`"C:\\a\\b\\c" -> "/c/a/b/c"`, () => {
    expect(
        transPathWinToUnix('C:\\a\\b\\c')
    ).toBe('/C/a/b/c');
});

test(`"d:/e/f/g" -> "/d/e/f/g"`, () => {
    expect(
        transPathWinToUnix('d:/e/f/g')
    ).toBe('/d/e/f/g');
});
