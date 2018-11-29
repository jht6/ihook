const { common } = require('..');

test('return 0 if the task command executed successfully', () => {
    let result = common({
        command: 'ls'
    });
    expect(result).toBe(0);
});

test('return none-zero if a none-zero exit character is assigned to exit command', () => {
    let result = common({
        command: 'exit 8'
    });
    expect(result).not.toBe(0);
});

test('return none-zero if the task command is empty', () => {
    let result = common();
    expect(result).not.toBe(0);
});
