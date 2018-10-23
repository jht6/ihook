const assume = require('assume');
const { addPreCommitItem } = require('../../../common/utils');

const TEST_SCRIPT_NAME = 'test-script-name';

describe('#addPreCommitItem', function () {

    it('correctly add config when no "pre-commit" or "precommit"', function () {
        let json = addPreCommitItem({}, TEST_SCRIPT_NAME);
        let preCommit = json['pre-commit'];
        assume(preCommit).is.a('array');
        assume(preCommit[0]).equals(TEST_SCRIPT_NAME);
    });

    ['pre-commit', 'precommit'].forEach(function (preCommitKey) {
        it(`correctly add config when it exists "${preCommitKey}":{run:["a"]}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: ['a']
                }
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('array');
            assume(preCommit.run[0]).equals('a');
            assume(preCommit.run[1]).equals(TEST_SCRIPT_NAME);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, 'a', true);
            preCommit = json[preCommitKey];
            assume(preCommit.run.length).equals(2);
            assume(preCommit.run[0]).equals('a');
            assume(preCommit.run[1]).equals(TEST_SCRIPT_NAME);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:""}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: ''
                }
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(TEST_SCRIPT_NAME);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:"a"}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: 'a'
                }
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(`a, ${TEST_SCRIPT_NAME}`);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, TEST_SCRIPT_NAME);
            preCommit = json[preCommitKey];
            assume(preCommit.run).equals(`a, ${TEST_SCRIPT_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:"a,b"}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: 'a,b'
                }
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(`a, b, ${TEST_SCRIPT_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:" a  , b-b  ,  c "}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: ' a  , b-b,  c '
                }
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(`a, b-b, c, ${TEST_SCRIPT_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":{}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {}
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('array');
            assume(preCommit.run).is.size(1);
            assume(preCommit.run[0]).equals(TEST_SCRIPT_NAME);
        });

        it(`correctly add config when it exists "${preCommitKey}":"a,b"`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: 'a,b'
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('string');
            assume(preCommit).equals(`a, b, ${TEST_SCRIPT_NAME}`);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, 'b');
            preCommit = json[preCommitKey];
            assume(preCommit).equals(`a, b, ${TEST_SCRIPT_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":["a"]`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: ['a']
            }, TEST_SCRIPT_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('array');
            assume(preCommit).is.size(2);
            assume(preCommit[0]).equals('a');
            assume(preCommit[1]).equals(TEST_SCRIPT_NAME);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, TEST_SCRIPT_NAME);
            preCommit = json[preCommitKey];
            assume(preCommit).is.size(2);
            assume(preCommit[0]).equals('a');
            assume(preCommit[1]).equals(TEST_SCRIPT_NAME);
        });
    });

});
