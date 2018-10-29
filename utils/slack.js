const Slack = require('slack');
const async = require('async');

const _api = new Slack({ token: process.env.SLACK_ACCESS_TOKEN });

module.exports = {
    listMembers(id, callback) {
        _api.conversations.members({ channel: id }, (err, response) => {
            if (err)
                callback(err);
            else if (!response.ok)
                callback(response.error);
            else
                callback(null, response.members);
        });
    },

    leave(channelid, callback) {
        _api.channels.leave({ channel: id }, (err, response) => {
            if (err)
                callback(err);
            else if (!response.ok)
                callback(response.error);
            else
                callback(null);
        });
    },

    kickMember(userid, channelid, callback) {
        _api.channels.kick({ channel: channelid, user: userid }, (err, response) => {
            if (err)
                callback(err);
            else if (!response.ok)
                callback(response.error);
            else
                callback(null);
        });
    },

    archiveChannel(id, kicker, callback) {
        if (typeof kicker == 'function')
        {
            callback = kicker;
            kicker = null;
        }

        async.waterfall([
            (andThen) => {
                if (kicker)
                    module.exports.listMembers(id, andThen);
                else
                    andThen(null, null);
            },

            (toKick, andThen) => {
                if (!toKick)
                    return andThen(null);

                async.each(toKick, (victim, next) => {
                    if (victim == kicker)
                        next(null);
                    else
                        module.exports.kickMember(victim, id, next);
                }, andThen);
            },

            (andThen) => {
                if (kicker)
                    module.exports.leave(id, andThen);
                else
                    andThen(null);
            },

            (andThen) => {
                _api.channels.archive({ channel: id }, (err, response) => {
                    if (err)
                        andThen(err);
                    else if (!response.ok)
                        andThen(response.error);
                    else
                        andThen(null);
                });
            }
        ], callback);
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