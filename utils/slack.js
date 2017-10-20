const Slack = require('slack');
const async = require('async');

const _api = new Slack({ token: process.env.SLACK_ACCESS_TOKEN });

module.exports = {
    archiveChannel(id, callback) {
        _api.channels.archive({ channel: id }, (err, response) => {
            console.log(JSON.stringify(response));
            if (err)
                callback(err);
            else if (!response.ok)
                callback(response.error);
            else
                callback(null);
        });
    },

    createChannel(name, purpose, callback) {
        if (typeof purpose == 'function') {
            callback = purpose;
            purpose = null;
        }

        async.waterfall([
            (andThen) => {
                _api.channels.create({ name: name }, (err, response) => {
                    if (err)
                        andThen(err);
                    else if (!response.ok)
                        andThen(response.error);
                    else
                        andThen(null, response.channel)
                });
            },

            (channel, andThen) => {
                if (!purpose)
                    return andThen(null, channel);

                _api.channels.setPurpose({ channel: channel.id, purpose: purpose }, (err, response) => {
                    if (err)
                        andThen(err);
                    else if (!response.ok)
                        andThen(response.error);
                    else
                        andThen(null, channel)
                });
            }
        ], (err, channel) => {
            if (err)
                callback(err);
            else
                callback(null, "Created channel #" + channel.name);
        });
    },

    sayInChannel(channelName, message, callback) {
        if (channelName.charAt(0) != '#')
            channelName = '#' + channelName;

        _api.chat.postMessage({
            channel: channelName,
            text: message,
            link_names: true,
            parse: true,
            as_user: true
        }, (err, response) => {
            if (err)
                callback(err);
            else if (!response.ok)
                callback(response.error);
            else
                callback(null, response.channel);
        });
    }
}