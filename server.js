var app = require('./app');


var port = process.env.NODE_PORT || 8000;
app.listen(port, function(err) {
  console.log('App is running on http://localhost:' + port);
});
