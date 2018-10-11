const assume = require('assume');
const { transPathWinToUnix } = require('../../../common/utils');

describe('#transPathWinToUnix', function () {
    it(`".\\\\a\\\\b" -> "./a/b"`, function () {
        assume(
            transPathWinToUnix('.\\\\a\\\\b')
        ).equals('./a/b');
    });

    it(`".\\a\\b" -> "./a/b"`, function () {
        assume(
            transPathWinToUnix('.\\a\\b')
        ).equals('./a/b');
    });

    it(`"./a/b" -> "./a/b"`, function () {
        assume(
            transPathWinToUnix('./a/b')
        ).equals('./a/b');
    });

    it(`"a/b/c" -> "a/b/c"`, function () {
        assume(
            transPathWinToUnix('a/b/c')
        ).equals('a/b/c');
    });

    it(`"a\\b\\c" -> "a/b/c"`, function () {
        assume(
            transPathWinToUnix('a\\b\\c')
        ).equals('a/b/c');
    });

    it(`"C:\\a\\b\\c" -> "/c/a/b/c"`, function () {
        assume(
            transPathWinToUnix('C:\\a\\b\\c')
        ).equals('/C/a/b/c');
    });

    it(`"d:/e/f/g" -> "/d/e/f/g"`, function () {
        assume(
            transPathWinToUnix('d:/e/f/g')
        ).equals('/d/e/f/g');
    });
});
