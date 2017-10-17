var _root = null;

function handleSlashCommand(req, res, next) {

}

module.exports = (app, root) => {
    _root = root;

    app.all(_root, handleSlashCommand);
};