/**
 * Some callbacks for pce-batch.
 */

module.exports = {

    filter: item => /\.js$/.test(item),

    useRelativePath: () => true,

    command: () => 'echo <paths> > batch_run_ok'
};
