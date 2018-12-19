/**
 * ihook config file
 */

module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                'echo ihook common task(from string config) is executed...',
                {
                    type: 'common',
                    command: 'echo ihook common task(from object config) is executed...'
                },
                {
                    type: 'batch',
                    filter: {
                        extensions: ['.js'],
                        ignoreRuleFiles: ['.eslintignore']
                    },
                    command: 'eslint <paths>'
                }
            ]
        }
    }
};
