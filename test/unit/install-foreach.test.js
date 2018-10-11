'use strict';

const assume = require('assume');
const Installer = require('../../scripts/install-foreach');

const {
    FOREACH_COMMAND_TPL,
    FOREACH_COMMAND_KEY,
    FOREACH_NAME
} = require('../../common/const')();

describe('install-foreach', function () {

    it('is exported as a function', function () {
        assume(Installer).is.a('function');;
    });

    it('can be initialized without a `new` keyword', function () {
        let installer = Installer();
        assume(installer).is.instanceOf(Installer);
        assume(installer.init).is.a('function');
    });

    describe('#addForeachInScripts', function () {
        it(`correctly add "${FOREACH_NAME}" in "scripts" of json`, function () {
            let installer = new Installer();
            let json = installer.addForeachInScripts({
                scripts: {}
            });
            let pceForeach = json.scripts[FOREACH_NAME];
            assume(pceForeach).is.a('string');
            assume(pceForeach).is.ok();
            assume(pceForeach).startWith('node ');
            assume(pceForeach).endsWith('foreach.js');
        });
    });

    describe('#addForeachCommand', function () {
        it(`correctly add "${FOREACH_COMMAND_KEY}" in json`, function () {
            let installer = new Installer();
            let json = installer.addForeachCommand({});
            assume(json[FOREACH_COMMAND_KEY]).equals(FOREACH_COMMAND_TPL);
        });
    });
});
