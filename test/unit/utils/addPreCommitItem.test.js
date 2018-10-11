const assume = require('assume');
const { addPreCommitItem } = require('../../../common/utils');

const { FOREACH_NAME } = require('../../../common/const')();

describe('#addPreCommitItem', function () {

    it('correctly add config when no "pre-commit" or "precommit"', function () {
        let json = addPreCommitItem({}, FOREACH_NAME);
        let preCommit = json['pre-commit'];
        assume(preCommit).is.a('array');
        assume(preCommit[0]).equals(FOREACH_NAME);
    });

    ['pre-commit', 'precommit'].forEach(function (preCommitKey) {
        it(`correctly add config when it exists "${preCommitKey}":{run:["a"]}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: ['a']
                }
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('array');
            assume(preCommit.run[0]).equals('a');
            assume(preCommit.run[1]).equals(FOREACH_NAME);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, 'a', true);
            preCommit = json[preCommitKey];
            assume(preCommit.run.length).equals(2);
            assume(preCommit.run[0]).equals('a');
            assume(preCommit.run[1]).equals(FOREACH_NAME);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:""}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: ''
                }
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(FOREACH_NAME);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:"a"}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: 'a'
                }
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(`a, ${FOREACH_NAME}`);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, FOREACH_NAME);
            preCommit = json[preCommitKey];
            assume(preCommit.run).equals(`a, ${FOREACH_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:"a,b"}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: 'a,b'
                }
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(`a, b, ${FOREACH_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":{run:" a  , b-b  ,  c "}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {
                    run: ' a  , b-b,  c '
                }
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('string');
            assume(preCommit.run).equals(`a, b-b, c, ${FOREACH_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":{}`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: {}
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('object');
            assume(preCommit.run).is.a('array');
            assume(preCommit.run).is.size(1);
            assume(preCommit.run[0]).equals(FOREACH_NAME);
        });

        it(`correctly add config when it exists "${preCommitKey}":"a,b"`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: 'a,b'
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('string');
            assume(preCommit).equals(`a, b, ${FOREACH_NAME}`);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, 'b');
            preCommit = json[preCommitKey];
            assume(preCommit).equals(`a, b, ${FOREACH_NAME}`);
        });

        it(`correctly add config when it exists "${preCommitKey}":["a"]`, function () {
            let json = addPreCommitItem({
                [preCommitKey]: ['a']
            }, FOREACH_NAME);
            let preCommit = json[preCommitKey];
            assume(preCommit).is.a('array');
            assume(preCommit).is.size(2);
            assume(preCommit[0]).equals('a');
            assume(preCommit[1]).equals(FOREACH_NAME);

            // if it can detect repetitive item?
            json = addPreCommitItem(json, FOREACH_NAME);
            preCommit = json[preCommitKey];
            assume(preCommit).is.size(2);
            assume(preCommit[0]).equals('a');
            assume(preCommit[1]).equals(FOREACH_NAME);
        });
    });

});
