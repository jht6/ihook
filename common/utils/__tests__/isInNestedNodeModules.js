const { isInNestedNodeModules } = require('..');

test(`/dir/node_modules/ihook -> false`, () => {
    expect(
        isInNestedNodeModules('/dir/node_modules/ihook')
    ).toBe(false);
});

test(`process.env.INIT_CWD=/dir -> false`, () => {
    process.env.INIT_CWD = '/dir';
    expect(
        isInNestedNodeModules()
    ).toBe(false);
    delete process.env.INIT_CWD;
});

test(`/dir/node_modules/pkg/node_modules/ihook -> true`, () => {
    expect(
        isInNestedNodeModules('/dir/node_modules/pkg/node_modules/ihook')
    ).toBe(true);
});

test(`process.env.INIT_CWD=/dir/node_modules/pkg -> true`, () => {
    process.env.INIT_CWD = '/dir/node_modules/pkg';
    expect(
        isInNestedNodeModules()
    ).toBe(true);
    delete process.env.INIT_CWD;
});
