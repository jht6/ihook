module.exports = () => ({
    BATCH_NAME: 'pce-batch',
    BATCH_SCRIPT: 'node ./node_modules/ihook/scripts/batch.js',
    LOG_PREFIX: 'ihook > ',
    CONFIG_FILE_NAME: 'ihook.config.js',
    BATCH_CMD_PARAM_TOKEN: '<paths>'
});
