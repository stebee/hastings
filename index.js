if (!process.env.SLACK_TOKEN)
{
    var env = require('node-env-file');
    env(__dirname + '/.env');
}

const express = require('express');
const bodyParser = require('body-parser');
const qs = require('querystring');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

require('./routes/endpoint')(app, '/commands');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
