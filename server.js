var Promise = require('bluebird'),
    mFactory = require('mitsuku-api'),
    cleverbot = require("cleverbot.io");

var cBot1 = proxyCleverbot({cleverbot: new cleverbot("XzFXgz8tNKnKEXWr", "8YDDSbvOQQS2OXlQXIt7D7XgnB1Gvfiv"), tag: "cb1"});
    cBot2 = proxyCleverbot({cleverbot: new cleverbot("joxeAvdfp88eqpVw", "WjroMMdxE1xEGJjVdeBgB2av68OWDK2b"), tag: "cb2"});

cBot1.setNick("Test Session 1");
cBot2.setNick("Test Session 2");

cBot1.create(function (err, session) {

});

cBot2.create(function (err, session) {

});

var mBot1 = mFactory({tag: 'Mitsuku'}),
    mBot2 = mFactory({tag: 'Mitsushi'});

// cBot.setNick("testSession");
//
// cBot.create(function (err, session) {
  // cBot.ask("Just a small town girl", function (err, response) {
  //   console.log(response); // Will likely be: "Living in a lonely world"
  // });
// });
//

// loopConvo(mBot1, mBot2, null, greet());

// loopConvo(cBot1, cBot2, null, greet());

loopConvo(mBot1, cBot2, null, greet());


function loopConvo(sender, receiver, prevMessage, nextMessage) {
    var prev = prevMessage || nextMessage;
    console.log(receiver + ": " + nextMessage);
    return new Promise(function (resolve, reject) {
        // say.speak(sender.getTag(), nextMessage, function () {
          // if (sender._tag) {
            // console.log("sending to mitsuku server");
            resolve(sender.send(nextMessage)
                .then(function (response) {
                    var repeated = flatten(response) == flatten(nextMessage),
                        next = response;
                    if (repeated) {
                        next = reverse(next);
                    }
                    console.log("prev =", prev);
                    console.log("next =", response);
                    prev = nextMessage; // added for cleverbot
                    return loopConvo(receiver, sender, prev, next);
                }));
          // }
          // if (sender.user) {
          //   console.log("sending to cleverbot server");
          //   resolve(sender.ask(nextMessage, function (err, response) {
          //     // var repeated = flatten(response) == flatten(nextMessage),
          //     //     next = response;
          //     // if (repeated) {
          //     //     next = reverse(next);
          //     // }
          //     return loopConvo(receiver, sender, prev, response);
          //   }));
          //       // .then(function (response) {
          //       //
          //       // }));
          // }
        // });
    });
}

function proxyCleverbot(options) {
    options = options || {};
    var cleverbot = options.cleverbot,
        tag = options.tag || 'Anonymous';
    return {
        send: function(message) {
            console.log('message =', message);
            return new Promise(function (resolve, reject) {
                cleverbot.ask(message, function (err, response) {
                    console.log('response =', response);
                    console.log('err =', err);
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

/* Generates a random greet
 * @return The greet
 */
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

function flatten(s) {
    return s.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
}

function reverse(s){
    return s.split("").reverse().join("");
}
