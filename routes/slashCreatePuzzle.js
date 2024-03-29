const slack = require('../utils/slack');
const async = require('async');
const puzzles = require('../utils/puzzles');

/* payload looks like this:
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


function doCreateCommand(payload, callback) {
    puzzles.puzzleForName(payload.text, (err, matches) => {
    });
}

module.exports = () => {
    return { command: 'createpuzzle', handler: doCreateCommand };
};