'use strict';

const assume = require('assume');
const Installer = require('../../scripts/install-batch');

const {
    BATCH_NAME,
    BATCH_SCRIPT
} = require('../../common/const')();

describe('install-batch', function () {

    it('is exported as a function', function () {
        assume(Installer).is.a('function');;
    });

    it('can be initialized without a `new` keyword', function () {
        let installer = Installer();
        assume(installer).is.instanceOf(Installer);
        assume(installer.init).is.a('function');
    });

    describe('#addBatchInScripts', function () {
        it(`correctly add "${BATCH_NAME}" in "scripts" of json`, function () {
            let installer = new Installer();
            let json = installer.addBatchInScripts({
                scripts: {}
            });
            let pceBatch = json.scripts[BATCH_NAME];
            assume(pceBatch).equals(BATCH_SCRIPT);
        });
    });
});
