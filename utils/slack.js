const Slack = require('slack');


module.exports = new Slack({ token: process.env.SLACK_ACCESS_TOKEN });