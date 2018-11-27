const path = require('path');

module.exports = {

    rootDir: path.resolve(__dirname, '../..'),

    globalSetup: "<rootDir>/test/__jest__/setup.js",

    globals: {
        __SAVE_SANDBOX__: true
    }

};
