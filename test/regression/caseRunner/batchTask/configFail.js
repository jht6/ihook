module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                {
                    type: 'batch',
                    command: 'echo <paths> > flag_batch_task_fail && exit 1'
                }
            ]
        }
    }
};
