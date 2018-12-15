module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                {
                    type: 'common',
                    command: 'touch common_obj_task_fail && exit 1'
                }
            ]
        }
    }
};
