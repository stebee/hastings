const slug = require('slug');
const fuse = require('fuse.js');
const async = require('async');

const _db = require('redis').createClient({ url: process.env.REDIS_URL });

const _keyRoot = 'Hastings';
const _keyPuzzleToChannel = _keyRoot + ':PuzzleToChannel';
const _keyPuzzles = _keyRoot + ':Puzzles';
function puzzleKeyForChannel(channel) {
    return _keyPuzzles + '[' + channel + ']';
}

function canonicalPuzzleName(name) {
    let result = name.replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .toLowerCase();
    return result;
}
function channelForPuzzleName(name, callback) {

}

function puzzleForChannel(channel, callback) {

}

function allPuzzleNames(callback) {
    redis.hkeys(_keyPuzzleToChannel, callback);
}

function closestPuzzleNames(name, callback) {
    allPuzzleNames((err, allPuzzles) => {
        if (err) return callback(err);

        const fuse = new Fuse(allPuzzles, {
            shouldSort: true,
            includeScore: true,
            threshold: 0.25,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1
        });
        let results = fuse.search(name);

        let matches = [ ];
        if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                if (results[i].score < 0.001)
                    return callback(null, results[i].item);

                matches.push(results[i].item);
            }
        }

        callback(null, matches);
    });
}


module.exports = {
    puzzleForName(name, callback) {
        let candidate = canonicalPuzzleName(name);
        closestPuzzleNames(candidate, (err, matches) => {
            if (!Array.isArray(matches)) {
                // Exact match found. Fetch and return.
            }
            else if (matches.length == 0) {
                // No reasonable matches found. Create and return.
            }
            else {

            }
        });
    },




};


/*
function getPuzzleEntryForName(puzzles, name, createIfMissing) {
    var names = [ ];

    for (var i = 0; i < puzzles.length; i++) {
        var thisName = puzzles[i].puzzleName;
        if (thisName == name)
            return puzzles[i];

        names.push(thisName);
    }

    var fuzzy = new FuzzyMatching(names);
    var match = fuzzy.get(name);

    if (match.distance > 0.7)
        return match.value;

    var puzzle = null;
    if (createIfMissing) {
        puzzle = {
            puzzleName: name,
            status: 'new'
        };
    }

    return puzzle;
}

function getPuzzleEntryForChannel(puzzles, channelName) {
    for (var i = 0; i < puzzles.length; i++) {
        if (puzzles[i].channelName == channelName)
            return puzzles[i];
    }

    return null;
}

function handlePuzzleCreate(controller, bot, message, puzzleName, sure) {
    controller.storage.teams.get(message.team, (err, data) => {
        if (err) return bot.reply(message, "Something's wrong: " + err);

        if (!data) {
            data = {};
            data.id = message.team;
        }

        if (!Array.isArray(data.puzzles)) {
            data.puzzles = [];
        }

        bot.reply(message, 'I think I should create channel #' + slug(puzzleName) + ' for the puzzle "' + puzzleName + '".');

        var found = getPuzzleEntryForName(data.puzzles, puzzleName, true);
        var dirty = false;

        if (typeof found == "string") {
            if (!sure) {
                bot.reply(message, '... but are you sure you didn\'t mean "' + found + '"?');

                controller.storage.users.save({id: message.user, lastPuzzleName: puzzleName }, (err) => {
                    if (err)
                        bot.reply(message, "Something's wrong: " + err);
                });
                return;
            }

            found = { puzzleName: puzzleName, status: 'new' };
        }

        if (found.status != 'new') {
            bot.reply(message, '...but it already exists!');
        }
        else {
            dirty = true;
            data.puzzles.push(found);
        }

        if (dirty) {
            async.waterfall([
                (andThen) => {
                    if (found.status != 'new') return andThen(null);

                    var channelName = slug(found.puzzleName, {
                        replacement: '',
                        remove: /\W+/,
                        lower: true
                    });
                    if (channelName.length > 21) {
                        channelName = channelName.substr(0, 21);
                    }

                    var existing = getPuzzleEntryForChannel(data.puzzles, channelName);

                    if (existing) {
                        channelName = channelName.substr(0, 16);
                        var suffix = String(Math.random() * 9999);
                        while (suffix.length < 4)
                            suffix = '0' + suffix;
                        channelName = channelName + '-' + suffix;
                    }

                    bot.api.channels.join({ name: '#' + channelName }, (err, response) => {
                        if (err) return andThen(err);

                        found.channelName = response.channel.name;
                        andThen(null, response.channel.id);
                    });
                },

                (channelId, andThen) => {
                    if (typeof channelId == "function") {
                        andThen = channelId;
                        channelId = null;
                    }
                    if (!channelId)
                        return andThen(null);

                    bot.api.channels.setPurpose({ channel: channelId, purpose: 'Discussion channel for puzzle "' + found.puzzleName + '".'}, (err, response) => {
                        if (err) return andThen(err);

                        return andThen(null);
                    });
                },

                (andThen) => {
                    if (!dirty) return andThen(null);

                    controller.storage.teams.save(data, (err, saved) => {
                        if (err) return andThen(err);

                        andThen(null);
                    });
                }
            ], (err) => {
                if (err) return bot.reply(message, "Something's wrong: " + JSON.stringify(err));

                bot.api.reactions.add({
                    name: 'thumbsup',
                    channel: message.channel,
                    timestamp: message.ts
                });
            });
        }
    });
}
*/

