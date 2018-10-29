const slack = require('../utils/slack');
const async = require('async');
const puzzles = require('../utils/puzzles');

/* payload looks like this:
 {
     "token":"SLACK_VERIFICATION_TOKEN",
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


function doWakeUp(payload, callback) {
    var command = null;
    var arg = null;

    var parts = payload.text.split(' ');
    if (parts.length > 1)
    {
        if (parts[0] == "do")
        {
            command = parts[1].toLowerCase();
            arg = parts[2];
        }
    }

    if (command)
    {
        if (command == "listmembers")
        {
            slack.listMembers(payload.channel_id, (err, response) => {
                return callback(err, JSON.stringify(response));
            });
        }
        else if (command == "kickmember")
        {
            slack.kickMember(arg, payload.channel_id, (err, response) => {
                return callback(err, JSON.stringify(response));
            });
        }
    }
    else
        callback(null, "Your behavior is continually unexpected.");
}

module.exports = () => {
    return { command: 'checkapi', handler: doWakeUp };
};