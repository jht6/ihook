module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                {
                    type: 'common',
                    command: 'touch flag_common_obj_task_fail && exit 1'
                }
            ]
        }
    }
};
