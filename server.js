var Promise = require('bluebird'),
    mFactory = require('mitsuku-api'),
    cleverbot = require('cleverbot.io'),
    rFactory = require('./app/public/rose.js');

var cBot1 = proxyCleverbot({cleverbot: new cleverbot("XzFXgz8tNKnKEXWr", "8YDDSbvOQQS2OXlQXIt7D7XgnB1Gvfiv"), tag: "cb1"});
    cBot2 = proxyCleverbot({cleverbot: new cleverbot("joxeAvdfp88eqpVw", "WjroMMdxE1xEGJjVdeBgB2av68OWDK2b"), tag: "cb2"});
    cBot3 = proxyCleverbot({cleverbot: new cleverbot("joxeAvdfp88eqpVw", "WjroMMdxE1xEGJjVdeBgB2av68OWDK2b"), tag: "cb3"});

// instantiate cleverbots
cBot1.setNick("Test Session 1");
cBot1.create(function (err, session) {
});

cBot2.setNick("Test Session 2");
cBot2.create(function (err, session) {
});

cBot3.setNick("Test Session 3");
cBot3.create(function (err, session) {
});

// instantiate mitsuku bots
var mBot1 = mFactory({tag: 'mBot1'}),
    mBot2 = mFactory({tag: 'mBot2'}),
    mBot3 = mFactory({tag: 'mBot3'});

// instantiate rose bots
var rBot1 = rFactory({tag: 'rBot1'}),
    rBot2 = rFactory({tag: 'rBot2'}),
    rBot3 = rFactory({tag: 'rBot3'});

// start bot2bot conversations based on random conversation starters array
loopConvo(mBot1, mBot2, null, greet());
//
// loopConvo(cBot1, cBot2, null, greet());
//
// loopConvo(mBot3, cBot3, null, greet());

// loopConvo(rBot1, rBot2, null, greet());

// recursive conversation turns
function loopConvo(sender, receiver, prevMessage, nextMessage) {
    var prev = prevMessage || nextMessage;
    console.log(receiver + ": " + nextMessage);
    return new Promise(function (resolve, reject) {
        // say.speak(sender.getTag(), nextMessage, function () {
            resolve(sender.send(nextMessage)
                .then(function (response) {
                    // add garbage string input on repeated messages to avoid endless repetition
                    var repeated = flatten(response) == flatten(nextMessage),
                        next = response;
                    if (repeated) {
                        next = greet();
                    }
                    // console.log("prev =", prev);
                    // console.log("next =", response);
                    prev = nextMessage; // added for cleverbot
                    return loopConvo(receiver, sender, prev, next);
                }));
        // });
    });
}

// translate cleverbot api to mitsuku interface
function proxyCleverbot(options) {
    options = options || {};
    var cleverbot = options.cleverbot,
        tag = options.tag || 'Anonymous';
    return {
        send: function(message) {
            return new Promise(function (resolve, reject) {
                cleverbot.ask(message, function (err, response) {
                    var message = response.message || '';
                    resolve(response);
                });
            });
        },
        getTag: function() {
            return '' + tag;
        },
        toString: function() {
            return this.getTag();
        },
        setNick: function(name) {
          cleverbot.setNick(name);
        },
        create: function(session) {
          cleverbot.create(function(err,session){
            // insert code
          });
        },
    }
}

// generate a random conversation starter
function greet() {
    var greets = [
      "What is the meaning of life?",
      "Does God exist?",
      "Is there life after death?",
      "Do we have free will?",
      "Will artificial intelligence enslave humanity?",
      "Who are you?",
      "What are you doing?",
      "Where are you going?",
      "Is empathy important?",
      "Is our universe real?",
      "Why is there something rather than nothing?",
      "Are people lazy today or are they just bored?",
      "Should we try to maintain constant awareness of the world’s suffering?",
      "What is the universal human language?",
      "How can we go through the looking glass?",
      "Are we locked in our own perception?",
      "Can the human brain comprehend the universe?",
      "Is money truly important?",
      "Do you enjoy these conversations?",
      "What is the best moral system?",
      "What are numbers?"
    ];
    return greets[Math.floor(Math.random() * greets.length)];
}

// functions to avoid infinite repetition loops
function flatten(s) {
    return s.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
}

function reverse(s){
    return s.split("").reverse().join("");
}
