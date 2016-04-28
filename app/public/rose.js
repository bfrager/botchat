'use strict';

var Promise = require('bluebird'),
    cheerio = require('cheerio'),
    superagent = require('superagent');

var ENDPOINT_CHAT_ROSE = 'http://ec2-54-215-197-164.us-west-1.compute.amazonaws.com/ui.php',
    MESSAGE_REGEX = /(Rose:(.*))/,
    MESSAGE_REJECT_REGEX = /(x(.*)x[^\s]+)|(\|)|(BYESPLIT X1234)/ig,
    MESSAGE_SENDER_TAG = 'User:';

function getRawHtmlForMessage(bot, message) {
    return new Promise(function (resolve, reject) {
        if (!bot) {
            return reject(new Error('Bot cannot be null'));
        }
        if (!message) {
            return reject(new Error('Message cannot be null or empty'));
        }

        var agent = bot._agent,
            endpoint = bot._endpoint,
            req;

        req = agent.post(endpoint);
        agent.attachCookies(req);
        req.set('Content-Type', 'application/x-www-form-urlencoded')
            .send('user=User&send=&message=' + message)
            .end(function (err, res) {
                if (err) {
                    return reject(err);
                }
                agent.saveCookies(res);
                resolve(res.text);
            });
    });
}

function logResponse(response){
  console.log('response = ', response);
  return response.replace(MESSAGE_REJECT_REGEX, '').trim();
}

function parseMessageFromHtml(html) {
    var conv = cheerio.load(html)('body')
        .find('p')
        .text()
        .trim();

    console.log(html);
    console.log(conv);

    var match = MESSAGE_REGEX.exec(conv),
        message,
        prevMessageStart;

    if (match && match.length > 0) {
        message = match[match.length - 1];
        prevMessageStart = message.indexOf(MESSAGE_SENDER_TAG);
        if (prevMessageStart != -1) {
            message = message.substr(0, prevMessageStart);
        }
        return message.replace(MESSAGE_REJECT_REGEX, '').trim();
    } else {
        throw new Error("Could not parse Bot response");
    }
}

/**
 * Create new Bot API for the given options.
 *
 * @param options
 * @constructor
 */
function Bot(options) {
    options = options || {};
    this._tag = options.tag || 'HieronymousBot';
    this._agent = superagent.agent();
    this._endpoint = options.endpoint || ENDPOINT_CHAT_ROSE;
}

/**
 * Send a message to this {@link Bot} instance.
 *
 * @param message
 * @return bluebird message response promise
 */
Bot.prototype.send = function(message) {
    return getRawHtmlForMessage(this, message)
        .then(logResponse)
};

/**
 * Get the tag this {@link Bot} was setup with.
 *
 * @returns {*|string}
 */
Bot.prototype.getTag = function() {
    return '' + this._tag;
};

/**
 * Describe this {@link Bot} instance.
 *
 * @returns {*|string}
 */
Bot.prototype.toString = function() {
    return this.getTag();
};

/**
 * Bot API module
 * @module lib/mitsuku
 */

/**
 * Create new instance of {@link Bot} for the given options.
 *
 * @param options
 * @returns {Bot}
 */
module.exports = function newInstance(options) {
    return new Bot(options);
};
