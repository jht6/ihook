/**
 * ihook config file
 */

module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                'echo ihook task is run.'
            ]
        }
    }
};
