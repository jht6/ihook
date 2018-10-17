const assume = require('assume');
const { isInNestedNodeModules } = require('../../../common/utils');

describe('#isInNestedNodeModules', function () {
    it(`/dir/node_modules/ihook -> false`, function () {
        assume(
            isInNestedNodeModules('/dir/node_modules/ihook')
        ).false();
    });

    it(`process.env.INIT_CWD=/dir -> false`, function () {
        process.env.INIT_CWD = '/dir';
        assume(
            isInNestedNodeModules()
        ).false();
        delete process.env.INIT_CWD;
    });

    it(`/dir/node_modules/pkg/node_modules/ihook -> true`, function () {
        assume(
            isInNestedNodeModules('/dir/node_modules/pkg/node_modules/ihook')
        ).true();
    });

    it(`process.env.INIT_CWD=/dir/node_modules/pkg -> true`, function () {
        process.env.INIT_CWD = '/dir/node_modules/pkg';
        assume(
            isInNestedNodeModules()
        ).true();
        delete process.env.INIT_CWD;
    });
});
