const slack = require('../utils/slack');
const async = require('async');
const puzzles = require('../utils/puzzles');

let _cancellingChannel = null;

function doCancelEndChannel(payload, callback) {
    if (_cancellingChannel)
    {
        slack.sayInChannel(_cancellingChannel.name, 'Nevermind!', (err) => {
            callback(null, 'Canceled pending archive of channel ' + _cancellingChannel.name);
            _cancellingChannel = null;
        });
    }
    else
        callback(null, 'Too late!');
}

function doEndChannel(payload, callback) {
    let channel = payload.text;
    if (channel.charAt(0) != '#')
        channel = '#' + channel;

    if (_cancellingChannel)
    {
        callback(null, "Sorry, I'm not a very smart robot. I only know how to cancel one channel at a time, and I'm already about to cancel " + _cancellingChannel.name + ".");
    }
    else
    {
        slack.sayInChannel(channel, 'This channel will be archived in 60 seconds. Say /cancelendchannel to grant a stay of execution.', (err, channelId) => {
            if (err)
                callback(null, "An error occurred: " + err);
            else {
                _cancellingChannel = { name: channel, id: channelId };
                setTimeout(() => {
                    if (_cancellingChannel) {
                        slack.archiveChannel(_cancellingChannel.id, (err) => {
                            if (err) {
                                console.log(JSON.stringify(_cancellingChannel));
                                console.log(JSON.stringify(err));
                            }
                            // Do nothing, we've already triggered the callback!
                            _cancellingChannel = null;
                        });
                    }
                }, 60000);
            }
            callback(null, 'Channel ' + channel + ' marked for termination in 60 seconds.');
        });
    }
}

module.exports = () => {
    return [
        { command: 'endchannel', handler: doEndChannel },
        { command: 'eom', handler: doEndChannel },
        { command: 'cancelendchannel', handler: doCancelEndChannel }
    ];
};