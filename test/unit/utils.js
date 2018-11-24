'use strict';

const assume = require('assume');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const utils = require('../../common/utils');

describe('common/utils', function () {



    describe('#log', function () {
        it('correctly handle a string', function () {
            let ret = utils.log('test', null, null, true);
            assume(ret).is.a('object');
            assume(ret.lines).is.a('array');
            assume(ret.lines.length).equals(3);
            assume(/test$/.test(ret.lines[1])).true();
        });

        it('correctly handle a string with "\\n"', function () {
            let ret = utils.log('a\nb\nc', null, null, true);
            assume(ret).is.a('object');
            assume(ret.lines).is.a('array');
            assume(ret.lines.length).equals(5);
            assume(/a$/.test(ret.lines[1])).true();
            assume(/b$/.test(ret.lines[2])).true();
            assume(/c$/.test(ret.lines[3])).true();
        });

        it('correctly handle an array', function () {
            let ret = utils.log(['a', 'b', 'c'], null, null, true);
            assume(ret).is.a('object');
            assume(ret.lines).is.a('array');
            assume(ret.lines.length).equals(5);
            assume(/a$/.test(ret.lines[1])).true();
            assume(/b$/.test(ret.lines[2])).true();
            assume(/c$/.test(ret.lines[3])).true();
        });

        it('default has color', function () {
            let ret = utils.log('test', null, null, true);
            assume(ret.lines[1]).contains('\u001b');
        });

        it('can remove color when "noColor" is set', function () {
            let ret = utils.log('test', null, {
                noColor: true
            }, true);
            assume(ret.lines[1].indexOf('\u001b')).equals(-1);
        });
    });



    describe('#readPackageJson', function () {
        let fn = utils.readPackageJson;
        let filename = 'tmp0.json';
        let filepath = path.join(__dirname, filename);

        it('throw an exception if the file "absPath" points to does not exist', function () {
            let hasException = false;
            try {
                fn(
                    path.join(__dirname, './not_exsit.json')
                );
            } catch (e) {
                hasException = true;
            }

            assume(hasException).true();
        });

        it('return null if the file\'s content cannot be parsed', function () {
            execSync([
                `cd test`,
                `cd unit`,
                `echo foo > ${filename}`
            ].join(` && `));

            let ret = fn(filepath);
            assume(ret).equals(null);
        });

        it('read json from a file successly', function () {
            execSync([
                `cd test`,
                `cd unit`,
                `echo {"name":"oj"} > ${filename}`
            ].join(` && `));

            let ret = fn(filepath);
            assume(ret).is.a('object');
            assume(ret.name).equals('oj');
        });

        after(function () {
            execSync([
                `cd test`,
                `cd unit`,
                `rm -f ${filename}`
            ].join(` && `));
        });
    });

    describe('#modifyPackageJson', function () {
        let fn = utils.modifyPackageJson;

        it('throw an exception if the file "absPath" points to does not exist', function () {
            let hasException = false;
            try {
                fn(path.resolve(__dirname, './not_exsit.json'));
            } catch (e) {
                hasException = true;
            }

            assume(hasException).true();
        });

        it('callback will receive an empty object if the file is empty', function () {
            let filename = 'tmp1.json';
            let filepath = path.join(__dirname, filename);

            execSync([
                `cd test`,
                `cd unit`,
                `touch ${filename}`
            ].join(` && `));

            let ret = fn(filepath, json => json);
            let json = utils.readPackageJson(filepath);

            assume(ret).true();
            assume(JSON.stringify(json)).equals('{}');

            execSync([
                `cd test`,
                `cd unit`,
                `rm -f ${filename}`
            ].join(` && `));
        });

        it('throw an exception if the callback return a non-object value', function () {
            let filename = 'tmp2.json';
            let filepath = path.join(__dirname, filename);

            execSync([
                `cd test`,
                `cd unit`,
                `touch ${filename}`
            ].join(` && `));

            let hasException = false;
            try {
                fn(
                    path.resolve(__dirname, filepath),
                    () => null
                );
            } catch (e) {
                hasException = true;
            }

            assume(hasException).true();

            execSync([
                `cd test`,
                `cd unit`,
                `rm -f ${filename}`
            ].join(` && `));
        });

        it('correctly save value to the file', function () {
            let filename = 'tmp3.json';
            let filepath = path.join(__dirname, filename);

            execSync([
                `cd test`,
                `cd unit`,
                `touch ${filename}`
            ].join(` && `));

            let ret = fn(
                filepath,
                () => ({foo: 'iLoveTSY'})
            );
            let json = utils.readPackageJson(filepath);

            assume(ret).true();
            assume(json.foo).equals('iLoveTSY');

            execSync([
                `cd test`,
                `cd unit`,
                `rm -f ${filename}`
            ].join(` && `));
        });
    });
});
