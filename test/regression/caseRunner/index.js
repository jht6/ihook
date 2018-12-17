module.exports = () => {
    require('./install')();
    require('./commonTask')();
    require('./batchTask')();
};
