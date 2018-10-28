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


function doCreateChannel(payload, callback) {
    let parts = payload.text.split(' ');
    let channel = parts.shift();
    let purpose = null;
    if (parts.length > 0)
        purpose = parts.join(' ');

    slack.createChannel(channel, purpose, (err, response) => {
        if (err)
            callback(null, "An error occurred: " + err);
        else {
            let message = 'I just created #' + channel;
            if (purpose)
                message += ': "' + purpose + '"';
            message += '. Join us!';

            slack.sayInChannel('#whatsnew', message, (err) => {
                if (err)
                {
                    console.log(JSON.stringify(err));
                    callback(null, "An error occurred: " + err);
                }
                else
                    callback(null, response);
            });
        }
    })
}

module.exports = () => {
    return { command: 'createchannel', handler: doCreateChannel };
};