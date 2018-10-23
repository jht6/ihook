const fs = require('fs');
const path = require('path');
const assume = require('assume');
const Hook = require('../../index');
const { LOG_PREFIX } = require('../../common/const');

/* istanbul ignore next */
describe('pre-commit', function () {
    'use strict';

    it('is exported as a function', function () {
        assume(Hook).is.a('function');
    });

    it('can be initialized without a `new` keyword', function () {
        let hook = Hook(() => {}, {
            isTesting: true
        });


        assume(hook).is.instanceOf(Hook);
        assume(hook.parse).is.a('function');
    });

    describe('#packageJsonDir', function () {
        let hook;

        beforeEach(function () {
            hook = new Hook(() => {}, {
                isTesting: true
            });
        });

        it('"packageJsonDir" points to a folder', function () {
            let stat = fs.lstatSync(hook.packageJsonDir);
            assume(stat.isDirectory()).is.true();
        });

        it('has "package.json" in "packageJsonDir"', function () {
            let hasPackageJson = fs.existsSync(
                path.join(hook.packageJsonDir, 'package.json')
            );
            assume(hasPackageJson).is.true();
        });
    });

    describe('#gitRootDir', function () {
        let hook;

        beforeEach(function () {
            hook = new Hook(() => {}, {
                isTesting: true
            });
        });

        it('"gitRootDir" points to a folder', function () {
            let stat = fs.lstatSync(hook.gitRootDir);
            assume(stat.isDirectory()).is.true();
        });

        it('has ".git" folder in "gitRootDir"', function () {
            let dotGitDirPath = path.join(hook.gitRootDir, '.git');
            let hasDotGitDir = fs.existsSync(dotGitDirPath);
            assume(hasDotGitDir).is.true();
            let stat = fs.lstatSync(dotGitDirPath);
            assume(stat.isDirectory()).is.true();
        });
    });

    describe('#parse', function () {
        let hook;

        beforeEach(() => {
            hook = new Hook(() => {}, {
                isTesting: true
            });
        });

        it('extracts configuration values from precommit.<flag>', function () {
            hook.json = {
                'precommit.silent': true
            };

            assume(hook.silent).is.false();

            hook.parse();

            assume(hook.config.silent).is.true();
            assume(hook.silent).is.true();
        });

        it('extracts configuration values from pre-commit.<flag>', function () {
            hook.json = {
                'pre-commit.silent': true
            };

            assume(hook.silent).is.false();

            hook.parse();

            assume(hook.config.silent).is.true();
            assume(hook.silent).is.true();
        });

        it('normalizes the `pre-commit` to an array', function () {
            hook.json = {
                'pre-commit': 'test, cows, moo'
            };

            hook.parse();

            assume(hook.config.run).is.length(3);
            assume(hook.config.run).contains('test');
            assume(hook.config.run).contains('cows');
            assume(hook.config.run).contains('moo');
        });

        it('normalizes the `precommit` to an array', function () {
            hook.json = {
                'precommit': 'test, cows, moo'
            };

            hook.parse();

            assume(hook.config.run).is.length(3);
            assume(hook.config.run).contains('test');
            assume(hook.config.run).contains('cows');
            assume(hook.config.run).contains('moo');
        });

        it('allows `pre-commit` object based syntax', function () {
            hook.json = {
                'pre-commit': {
                    run: 'test scripts go here',
                    silent: true
                }
            };

            hook.parse();

            assume(hook.config.run).is.length(4);
            assume(hook.config.run).contains('test');
            assume(hook.config.run).contains('scripts');
            assume(hook.config.run).contains('go');
            assume(hook.config.run).contains('here');
            assume(hook.silent).is.true();
        });

        it('defaults to `test` if nothing is specified', function () {
            hook.json = {
                scripts: {
                    test: 'mocha test.js'
                }
            };

            hook.parse();
            assume(hook.config.run).deep.equals(['test']);
        });

        it('ignores the default npm.script.test placeholder', function () {
            hook.json = {
                scripts: {
                    test: 'echo "Error: no test specified" && exit 1'
                }
            };

            hook.parse();
            assume(hook.config.run).has.length(0);
        });
    });

    describe('#log', () => {
        it('prefixes the logs with `pre-commit`', function (next) {
            let hook = new Hook((code, lines) => {
                assume(code).equals(1);
                assume(lines).is.a('array');
                assume(lines[0]).includes(LOG_PREFIX);
                assume(lines[1]).includes(LOG_PREFIX);
                assume(lines[1]).includes('foo');
                assume(lines).has.length(3);

                next();
            }, {
                isTesting: true
            });

            hook.config.silent = true;
            hook.log(['foo']);
        });

        it('allows for a custom error code', function (next) {
            let hook = new Hook((code, lines) => {
                assume(code).equals(0);

                next();
            }, {
                isTesting: true
            });

            hook.config.silent = true;
            hook.log(['foo'], 0);
        });

        it('allows strings to be split \\n', function (next) {
            let hook = new Hook((code, lines) => {
                assume(code).equals(0);

                assume(lines).has.length(4);
                assume(lines[1]).contains('foo');
                assume(lines[2]).contains('bar');

                next();
            }, {
                isTesting: true
            });

            hook.config.silent = true;
            hook.log('foo\nbar', 0);
        });

        it('output lines to stderr if error code 1', function (next) {
            let err = console.error;
            next = assume.plan(4, next);

            let hook = new Hook((code, lines) => {
                console.error = err;
                next();
            }, {
                isTesting: true
            });

            console.error = (line) => {
                assume(line).contains(LOG_PREFIX);
            };

            hook.log('foo\nbar', 1);
        });

        it('output lines to stdout if error code 0', function (next) {
            let log = console.log;
            next = assume.plan(4, next);

            let hook = new Hook((code, lines) => {
                console.log = log;
                next();
            }, {
                isTesting: true
            });

            console.log = (line) => {
                assume(line).contains(LOG_PREFIX);
            };

            hook.log('foo\nbar', 0);
        });
    });

    describe('#run', () => {
        it('runs the specified scripts and exit with 0 on no error', function (next) {
            let hook = new Hook((code, lines) => {
                assume(code).equals(0);
                assume(lines).is.undefined();

                next();
            }, {
                isTesting: true
            });

            hook.config.run = ['example-pass'];
            hook.run();
        });

        it('runs the specified test and exits with 1 on error', function (next) {
            let hook = new Hook((code, lines) => {
                assume(code).equals(1);

                assume(lines).is.a('array');
                assume(lines[1]).contains('`example-fail`');
                assume(lines[2]).contains('code (1)');

                next();
            }, {
                isTesting: true
            });

            hook.config.run = ['example-fail'];
            hook.run();
        });
    });
});
