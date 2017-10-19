const fs = require('fs');
const path = require('path');
const async = require('async');

let _root = null;
let _commands = [ ];

function handleSlashCommand(req, res, next) {
    if (req.body.token != process.env.SLACK_VERIFICATION_TOKEN) {
        res.status(403);
        return res.render();
    }

    /* req.body looks like this:
    {
        "token":"K9NoPSqSzXdjcNmD632wc6Wq",
        "team_id":"T7JFVFZMJ",
        "team_domain":"brinyshark",
        "channel_id":"C7JETRL4T",
        "channel_name":"bottesting",
        "user_id":"U7JC25RQT",
        "user_name":"siobhan.beeman",
        "command":"/debugtinker",
        "text":"#whatsnew",
        "response_url":"https://hooks.slack.com/commands/T7JFVFZMJ/256951470400/mRLq5aQ1n8lbLoxdZXK1bV8I",
        "trigger_id":"257742302773.256539543732.419c6992ceb1b3e1441e527f779c5849"
    }*/

    let command = req.body.command.substr(1).toLowerCase();
    let handled = false;
    for (let i = 0; i < _commands.length && !handled; i++) {
        if (_commands[i].command == command) {
            handled = true;
            _commands[i].handler(req.body, (err, response) => {
                if (err) {
                    console.log('Slash command error "' + err + '" for request ' + JSON.stringify(req.body));
                    res.send("I'm afraid something went wrong: " + err);
                }
                else {
                    res.send(response);
                }

                return;
            });
        }
    }

    if (!handled) {
        console.log('Unrecognized command ' + command + ' for request ' + JSON.stringify(req.body));
        res.send("I'm not sure what you mean.");
    }
}

function registerCommand(req) {
    let result = req();
    if (Array.isArray(result)) {
        _commands = _commands.concat(result);
    }
    else {
        _commands.push(result);
    }
}

module.exports = (app, root) => {
    _root = root;

    fs.readdirSync(__dirname).forEach((filename) => {
        if (filename.substr(0, 5) == 'slash' && filename.substr(-3, 3) == '.js')
            registerCommand(require('./' + filename.substr(0, filename.length - 3)));
    });

    app.all(_root, handleSlashCommand);
};