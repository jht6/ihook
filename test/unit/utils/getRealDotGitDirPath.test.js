const assume = require('assume');
const { execSync } = require('child_process');
const { getRealDotGitDirPath } = require('../../../common/utils');
const SEP = require('path').sep;
const UT_BOX = 'ut_box';
const SUBMODULE_DIR = 'submodule_dir';
const FOO = 'foo';

describe('#getRealDotGitDirPath', function () {
    before(function () {
        execSync([
            `rm -rf ${UT_BOX}`,
            `mkdir ${UT_BOX}`,
            `cd ${UT_BOX}`,
            `mkdir .git`,
            `cd .git`,
            `mkdir modules`,
            `cd modules`,
            `mkdir ${SUBMODULE_DIR}`,
            `cd ../..`,
            `mkdir ${FOO}`,
            `cd ${FOO}`,
            `mkdir ${SUBMODULE_DIR}`,
            `cd ${SUBMODULE_DIR}`,
            `echo gitdir: ../../.git/modules/${SUBMODULE_DIR} > .git`
        ].join(` && `));
    });

    after(function () {
        execSync(`rm -rf ${UT_BOX}`);
    });

    it(`get "null" if no param passed in ihook's Git project`, function () {
        let ret = getRealDotGitDirPath();
        assume(ret === null).true();
    });

    it(`find "/x/ihook/${UT_BOX}/.git" directory if pass "/x/ihook/${UT_BOX}/${FOO}"`, function () {
        let ret = getRealDotGitDirPath(`./${UT_BOX}/${FOO}`);
        assume(ret.endsWith(`${SEP}ihook${SEP}${UT_BOX}${SEP}.git`)).true();
    });

    it(`find "x/ihook/.git/modules/${SUBMODULE_DIR}" directory if pass "/x/ihook/${UT_BOX}/${FOO}/${SUBMODULE_DIR}"`, function () {
        let ret = getRealDotGitDirPath(`./${UT_BOX}/${FOO}/${SUBMODULE_DIR}`);
        assume(ret.endsWith(`${SEP}ihook${SEP}${UT_BOX}${SEP}.git${SEP}modules${SEP}${SUBMODULE_DIR}`)).true();
    });
});
