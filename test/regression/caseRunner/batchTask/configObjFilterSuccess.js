module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                {
                    type: 'batch',
                    filter: {
                        extensions: ['.js', '.ts'],
                        ignoreRuleFiles: ['.testignore']
                    },
                    command: 'echo <paths> > flag_batch_task_obj_filter_success'
                }
            ]
        }
    }
};
