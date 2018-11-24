const { execSync } = require('child_process');
const { getRealDotGitDirPath } = require('..');
const SEP = require('path').sep;
const UT_BOX = 'ut_box';
const SUBMODULE_DIR = 'submodule_dir';
const FOO = 'foo';

beforeAll(() => {
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

afterAll(() => {
    execSync(`rm -rf ${UT_BOX}`);
});

test(`get "null" if no param passed in ihook's Git project`, () => {
    let ret = getRealDotGitDirPath();
    expect(ret === null).toBe(true);
});

test(`find "/x/ihook/${UT_BOX}/.git" directory if pass "/x/ihook/${UT_BOX}/${FOO}"`, () => {
    let ret = getRealDotGitDirPath(`./${UT_BOX}/${FOO}`);
    expect(ret.endsWith(`${SEP}ihook${SEP}${UT_BOX}${SEP}.git`)).toBe(true);
});

test(`find "x/ihook/.git/modules/${SUBMODULE_DIR}" directory if pass "/x/ihook/${UT_BOX}/${FOO}/${SUBMODULE_DIR}"`, () => {
    let ret = getRealDotGitDirPath(`./${UT_BOX}/${FOO}/${SUBMODULE_DIR}`);
    expect(ret.endsWith(`${SEP}ihook${SEP}${UT_BOX}${SEP}.git${SEP}modules${SEP}${SUBMODULE_DIR}`)).toBe(true);
});
