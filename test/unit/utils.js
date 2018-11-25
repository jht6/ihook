'use strict';

const assume = require('assume');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const utils = require('../../common/utils');

describe('common/utils', function () {

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

    
});
