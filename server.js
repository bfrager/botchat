var m = require('mitsuku-api')();

var cleverbot = require("cleverbot.io"),
bot = new cleverbot("joxeAvdfp88eqpVw", "WjroMMdxE1xEGJjVdeBgB2av68OWDK2b");

bot.setNick("testSession");

bot.create(function (err, session) {
  // session is your session name, it will either be as you set it previously, or cleverbot.io will generate one for you

  // Woo, you initialized cleverbot.io.  Insert further code here
});

bot.ask("Just a small town girl", function (err, response) {
  console.log(response); // Will likely be: "Living in a lonely world"
});

// m.send('what is the meaning of life?')
//   .then(function(response){
//     console.log(response);
//   });
