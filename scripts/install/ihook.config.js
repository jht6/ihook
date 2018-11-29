/**
 * ihook config file
 */

module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                'echo ihook task is run.',
                {
                    type: 'common',
                    command: 'echo ihook common task is run.'
                },
                {
                    type: 'batch',
                    command: 'eslint <paths>'
                }
            ]
        }
    }
};
