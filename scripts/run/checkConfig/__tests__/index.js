const codes = require('../codes');
const checkConfig = require('..');

test('get SKIP_HOOK if no config or no config.hooks', () => {
    expect(checkConfig(null)).toBe(codes.SKIP_HOOK);
    expect(checkConfig({})).toBe(codes.SKIP_HOOK);
});

test('get HOOKS_INVALID if config.hooks is not an object', () => {
    expect(checkConfig({
        hooks: []
    })).toBe(codes.HOOKS_INVALID);
});

test('get SKIP_HOOK if config.hooks does not contain specified hook', () => {
    expect(checkConfig({
        hooks: {}
    }, 'pre-commit')).toBe(codes.SKIP_HOOK);
});

test('get HOOK_CONFIG_INVALID if hooks[hookName] is not an object', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': []
        }
    }, 'pre-commit')).toBe(codes.HOOK_CONFIG_INVALID);
});

test('get TASKS_INVALID if hooks[hookName].tasks is not an array', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: {}
            }
        }
    }, 'pre-commit')).toBe(codes.TASKS_INVALID);
});

test('get TASK_ITEM_TYPE_INVALID if task item is not a string or object', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: [123]
            }
        }
    }, 'pre-commit')).toBe(codes.TASK_ITEM_TYPE_INVALID);
});

test('get TASK_ITEM_LACK_TYPE if task item lack "type"', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: [
                    {
                        command: 'echo 123'
                    }
                ]
            }
        }
    }, 'pre-commit')).toBe(codes.TASK_ITEM_LACK_TYPE);
});

test('get TASK_ITEM_LACK_COMMAND if task item lack "command"', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: [
                    {
                        type: 'common'
                    }
                ]
            }
        }
    }, 'pre-commit')).toBe(codes.TASK_ITEM_LACK_COMMAND);
});

test('get TASK_ITEM_FILTER_TYPE_INVALID if batch task filter is invalid', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: [
                    {
                        type: 'batch',
                        command: 'echo aaa',
                        filter: 123
                    }
                ]
            }
        }
    }, 'pre-commit')).toBe(codes.TASK_ITEM_FILTER_TYPE_INVALID);
});

test('get TASK_ITEM_FILTER_IGNORERULEFILES_TYPE_INVALID if batchtask.filter.ignoreRuleFiles is invalid', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: [
                    {
                        type: 'batch',
                        command: 'echo aaa',
                        filter: {
                            ignoreRuleFiles: {}
                        }
                    }
                ]
            }
        }
    }, 'pre-commit')).toBe(codes.TASK_ITEM_FILTER_IGNORERULEFILES_TYPE_INVALID);
});

test('get TASK_ITEM_FILTER_EXTENSIONS_TYPE_INVALID if batchtask.filter.extensions is invalid', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: [
                    {
                        type: 'batch',
                        command: 'echo aaa',
                        filter: {
                            extensions: {}
                        }
                    }
                ]
            }
        }
    }, 'pre-commit')).toBe(codes.TASK_ITEM_FILTER_EXTENSIONS_TYPE_INVALID);
});

test('get true if config is valid', () => {
    expect(checkConfig({
        hooks: {
            'pre-commit': {
                tasks: [
                    'echo aaa',
                    {
                        type: 'common',
                        command: 'echo bbb'
                    },
                    {
                        type: 'batch',
                        command: 'echo aaa',
                        filter: {
                            ignoreRuleFiles: ['.eslintignore'],
                            extensions: ['.js', 'jsx']
                        }
                    }
                ]
            }
        }
    }, 'pre-commit')).toBe(true);
});
