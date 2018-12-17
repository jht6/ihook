/**
 * Before running test, create a real directory structure for test.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { log } = require('../../common/utils');

const cacheDir = 'rtcache';

module.exports = testDirName => {

    // If there is an exsiting "sandbox" dir, remove it.
    if (fs.existsSync(testDirName)) {
        try {
            execSync(`rm -rf ./${testDirName}`);
        } catch (e) {
            log(`Can't remove the existing "${testDirName}" directory, skip testing.`, 0);
        }
    }

    // Create "sandbox" directory and some files and directory in sandbox.
    try {
        execSync([
            `mkdir ${testDirName}`,
            `cd ${testDirName}`,
            `mkdir node_modules`,
            `cd node_modules`,
            `mkdir ihook`,
            `cd ..`,
            `echo node_modules > .gitignore`,
            `echo {} > package.json`,
            `git init`,
            `git config user.name "tester"`,
            `git config user.email "test@test.com"`
        ].join(` && `));
    } catch (e) {
        log(`Can't create file construct in "sandbox" directory, skip testing.`, 0);
    }

    // Copy code file.
    try {
        [
            'common',
            'scripts',
            'package.json'
        ].forEach(name => {
            execSync(`cp -r ./${name} ./${testDirName}/node_modules/ihook`);
        });
    } catch (e) {
        log(`Error occured when copy code file to sandbox, skip testing.`, 0);
    }

    if (
        fs.existsSync(
            path.join(process.cwd(), cacheDir)
        )
    ) {
        // use cache if it is available
        execSync(`cp -r ${cacheDir} ${testDirName}/node_modules/ihook/node_modules`);
    } else {
        // if no cache available, download by npm and save dependencies as cache
        try {
            execSync([
                `cd ${testDirName}/node_modules/ihook`,
                `npm install --production`,
                `cp -r node_modules ../../../${cacheDir}`
            ].join(` && `));
        } catch (e) {
            log(`Error occured when install dependence for copied code in sandbox, skip testing.`, 0);
        }
    }
};
