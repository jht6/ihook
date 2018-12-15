module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                'touch flag_common_str_task_fail && exit 1'
            ]
        }
    }
};
