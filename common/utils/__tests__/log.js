const { log } = require('..');

test('correctly handle a string', () => {
    let ret = log('test', null, null, true);
    expect(typeof ret).toBe('object');
    expect(Array.isArray(ret.lines)).toBe(true);
    expect(ret.lines.length).toBe(3);
    expect(/test$/.test(ret.lines[1])).toBe(true);
});

test('correctly handle a string with "\\n"', () => {
    let ret = log('a\nb\nc', null, null, true);
    expect(typeof ret).toBe('object');
    expect(Array.isArray(ret.lines)).toBe(true);
    expect(ret.lines.length).toBe(5);
    expect(/a$/.test(ret.lines[1])).toBe(true);
    expect(/b$/.test(ret.lines[2])).toBe(true);
    expect(/c$/.test(ret.lines[3])).toBe(true);
});

test('correctly handle an array', () => {
    let ret = log(['a', 'b', 'c'], null, null, true);
    expect(typeof ret).toBe('object');
    expect(Array.isArray(ret.lines)).toBe(true);
    expect(ret.lines.length).toBe(5);
    expect(/a$/.test(ret.lines[1])).toBe(true);
    expect(/b$/.test(ret.lines[2])).toBe(true);
    expect(/c$/.test(ret.lines[3])).toBe(true);
});

test('default has color', () => {
    let ret = log('test', null, null, true);
    expect(ret.lines[1]).toContain('\u001b');
});

test('can remove color when "noColor" is set', () => {
    let ret = log('test', null, {
        noColor: true
    }, true);
    expect(ret.lines[1].indexOf('\u001b')).toBe(-1);
});
