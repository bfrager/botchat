var m = require('mitsuku-api')();

m.send('hello world')
  .then(function(response){
    console.log(response);
  });
