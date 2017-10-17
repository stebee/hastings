const slack = require('../utils/slack');

function doCreateCommand(payload, callback) {
    callback(null, "doCreateCommand called");

}

module.exports = () => {
    return { command: 'createPuzzle', handler: doCreateCommand };
};