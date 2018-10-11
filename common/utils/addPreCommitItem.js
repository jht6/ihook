/**
 * Append a script to "pre-commit" of an object.
 * @param {Object} json an object
 * @param {String} scriptName the name will be appended to "pre-commit" of json
 */
function addPreCommitItem(json, scriptName) {
    if (Object.prototype.toString.call(json) !== '[object Object]') {
        throw Error('argument "json" must be an object.');
    }

    if (typeof scriptName !== 'string' || !scriptName) {
        throw Error('argument "json" must be a non-empty string.');
    }

    let preCommitKey,
        preCommit;
    if (json['pre-commit']) {
        preCommitKey = 'pre-commit';
        preCommit = json[preCommitKey];
    } else if (json['precommit']) {
        preCommitKey = 'precommit';
        preCommit = json[preCommitKey];
    } else {
        preCommitKey = 'pre-commit';
        preCommit = null;
    }

    let scripts;
    if (!preCommit) { // no "pre-commit" or "precommit" config now
        json[preCommitKey] = [scriptName];
    } else if (Object.prototype.toString.call(preCommit) === '[object Object]') {
        if (Array.isArray(json[preCommitKey].run)) { // for format of {run: ["a", "b", "c"]}
            if (!json[preCommitKey].run.includes(scriptName)) {
                json[preCommitKey].run.push(scriptName);
            }
        } else if (typeof json[preCommitKey].run === 'string') { // for format of {run: "a, b, c"}
            scripts = preCommit.run.split(/[, ]+/).filter(cmd => !!cmd);

            if (!scripts.includes(scriptName)) {
                json[preCommitKey].run = scripts.concat(scriptName).join(', ');
            }
        } else {
            json[preCommitKey].run = [scriptName];
        }
    } else if (typeof preCommit === 'string') { // for format of "a, b, c"
        scripts = preCommit.split(/[, ]+/).filter(cmd => !!cmd);

        if (!scripts.includes(scriptName)) {
            json[preCommitKey] = scripts.concat(scriptName).join(', ');
        }
    } else if (Array.isArray(preCommit)) { // for format of ["a, b, c"]
        if (!preCommit.includes(scriptName)) {
            json[preCommitKey].push(scriptName);
        }
    }

    return json;
}

module.exports = addPreCommitItem;
