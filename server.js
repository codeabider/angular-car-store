const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/dist/angular-car-store'));

app.listen(process.env.PORT || 8080);

// PathLocationStrategy

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/angular-car-store/index.html'));
});

console.log('Heroku server listening!!');
