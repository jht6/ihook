const assume = require('assume');
const { getIhookDirPath } = require('../../../common/utils');

describe('#getIhookDirPath', function () {
    it('correctly return path of "ihook" directory', function () {
        let ihookDirPath = getIhookDirPath();
        assume(/ihook$/.test(ihookDirPath)).true();
    });
});
