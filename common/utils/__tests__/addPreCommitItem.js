const { addPreCommitItem } = require('..');

const TEST_SCRIPT_NAME = 'test-script-name';

test('correctly add config when no "pre-commit" or "precommit"', () => {
    let json = addPreCommitItem({}, TEST_SCRIPT_NAME);
    let preCommit = json['pre-commit'];
    expect(Array.isArray(preCommit)).toBe(true);
    expect(preCommit[0]).toBe(TEST_SCRIPT_NAME);
});

['pre-commit', 'precommit'].forEach(function (preCommitKey) {
    test(`correctly add config when it exists "${preCommitKey}":{run:["a"]}`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: {
                run: ['a']
            }
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(typeof preCommit).toBe('object');
        expect(Array.isArray(preCommit.run)).toBe(true);
        expect(preCommit.run[0]).toBe('a');
        expect(preCommit.run[1]).toBe(TEST_SCRIPT_NAME);

        // if it can detect repetitive item?
        json = addPreCommitItem(json, 'a', true);
        preCommit = json[preCommitKey];
        expect(preCommit.run.length).toBe(2);
        expect(preCommit.run[0]).toBe('a');
        expect(preCommit.run[1]).toBe(TEST_SCRIPT_NAME);
    });

    test(`correctly add config when it exists "${preCommitKey}":{run:""}`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: {
                run: ''
            }
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(typeof preCommit).toBe('object');
        expect(typeof preCommit.run).toBe('string');
        expect(preCommit.run).toBe(TEST_SCRIPT_NAME);
    });

    test(`correctly add config when it exists "${preCommitKey}":{run:"a"}`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: {
                run: 'a'
            }
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(typeof preCommit).toBe('object');
        expect(typeof preCommit.run).toBe('string');
        expect(preCommit.run).toBe(`a, ${TEST_SCRIPT_NAME}`);

        // if it can detect repetitive item?
        json = addPreCommitItem(json, TEST_SCRIPT_NAME);
        preCommit = json[preCommitKey];
        expect(preCommit.run).toBe(`a, ${TEST_SCRIPT_NAME}`);
    });

    test(`correctly add config when it exists "${preCommitKey}":{run:"a,b"}`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: {
                run: 'a,b'
            }
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(typeof preCommit).toBe('object');
        expect(typeof preCommit.run).toBe('string');
        expect(preCommit.run).toBe(`a, b, ${TEST_SCRIPT_NAME}`);
    });

    test(`correctly add config when it exists "${preCommitKey}":{run:" a  , b-b  ,  c "}`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: {
                run: ' a  , b-b,  c '
            }
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(typeof preCommit).toBe('object');
        expect(typeof preCommit.run).toBe('string');
        expect(preCommit.run).toBe(`a, b-b, c, ${TEST_SCRIPT_NAME}`);
    });

    test(`correctly add config when it exists "${preCommitKey}":{}`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: {}
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(typeof preCommit).toBe('object');
        expect(Array.isArray(preCommit.run)).toBe(true);
        expect(preCommit.run.length).toBe(1);
        expect(preCommit.run[0]).toBe(TEST_SCRIPT_NAME);
    });

    test(`correctly add config when it exists "${preCommitKey}":"a,b"`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: 'a,b'
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(typeof preCommit).toBe('string');
        expect(preCommit).toBe(`a, b, ${TEST_SCRIPT_NAME}`);

        // if it can detect repetitive item?
        json = addPreCommitItem(json, 'b');
        preCommit = json[preCommitKey];
        expect(preCommit).toBe(`a, b, ${TEST_SCRIPT_NAME}`);
    });

    test(`correctly add config when it exists "${preCommitKey}":["a"]`, () => {
        let json = addPreCommitItem({
            [preCommitKey]: ['a']
        }, TEST_SCRIPT_NAME);
        let preCommit = json[preCommitKey];
        expect(Array.isArray(preCommit)).toBe(true);
        expect(preCommit.length).toBe(2);
        expect(preCommit[0]).toBe('a');
        expect(preCommit[1]).toBe(TEST_SCRIPT_NAME);

        // if it can detect repetitive item?
        json = addPreCommitItem(json, TEST_SCRIPT_NAME);
        preCommit = json[preCommitKey];
        expect(preCommit.length).toBe(2);
        expect(preCommit[0]).toBe('a');
        expect(preCommit[1]).toBe(TEST_SCRIPT_NAME);
    });
});

