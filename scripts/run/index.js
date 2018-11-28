'use strict';

const getResolvedTasks = require('./getResolvedTasks');

function run() {
    let tasks = getResolvedTasks(process.argv);
    console.log(tasks);
}

run();
