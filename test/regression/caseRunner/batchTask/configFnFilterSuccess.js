module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                {
                    type: 'batch',
                    filter: name => /\.js$/.test(name),
                    command: 'echo <paths> > flag_batch_task_fn_filter_success'
                }
            ]
        }
    }
};
