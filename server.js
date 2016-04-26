var Promise = require('bluebird'),
    mBot = require('mitsuku-api')(),
    mBot2 = require('mitsuku-api')(),
    cleverbot = require("cleverbot.io"),
    cBot = new cleverbot("joxeAvdfp88eqpVw", "WjroMMdxE1xEGJjVdeBgB2av68OWDK2b");

// var START_WITH_PHRASE = 'What is the meaning of life?';

// cBot.setNick("testSession");
//
// cBot.create(function (err, session) {
  // cBot.ask("Just a small town girl", function (err, response) {
  //   console.log(response); // Will likely be: "Living in a lonely world"
  // });
// });
//
// mBot.send('what is the meaning of life?')
//   .then(function(response){
//     console.log(response);
//   });

loopConverse(mBot, mBot2, null, greet());

function loopConverse(sender, receiver, prevMessage, nextMessage) {
    var prev = prevMessage || nextMessage;
    console.log(receiver + ": " + nextMessage);
    return new Promise(function (resolve, reject) {
        // say.speak(sender.getTag(), nextMessage, function () {
          if (sender._tag) {
            // console.log("sending to mitsuku server");
            resolve(sender.send(nextMessage)
                .then(function (response) {
                    // var repeated = flatten(response) == flatten(nextMessage),
                    //     next = response;
                    // if (repeated) {
                    //     next = reverse(next);
                    // }
                    return loopConverse(receiver, sender, prev, response);
                }));
          }
          if (sender.user) {
            console.log("sending to cleverbot server");
            resolve(sender.ask(nextMessage, function (err, response) {
              // var repeated = flatten(response) == flatten(nextMessage),
              //     next = response;
              // if (repeated) {
              //     next = reverse(next);
              // }
              return loopConverse(receiver, sender, prev, response);
            }));
                // .then(function (response) {
                //
                // }));
          }
        // });
    });
}

/* Generates a random greet
 * @return The greet
 */
function greet() {
    var greets = ["what is the meaning of life?", "Does God exist?", "Is there life after death?", "Do we have free will?", "Will artificial intelligence enslave humanity?"];
    return greets[Math.floor(Math.random() * greets.length)];
}

function flatten(s) {
    return s.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
}

function reverse(s){
    return s.split("").reverse().join("");
}

function proxyCleverbot(options) {
    options = options || {};
    var cleverbot = options.cleverbot,
        tag = options.tag || 'Anonymous';
    return {
        send: function(message) {
            return new Promise(function (resolve, reject) {
                cleverbot.ask(message, function (err, response) {
                    var message = response.message || '';
                    resolve(message);
                });
            });
        },
        getTag: function() {
            return '' + tag;
        },
        toString: function() {
            return this.getTag();
        }
    }
}
