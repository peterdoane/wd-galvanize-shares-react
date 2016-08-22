'use strict';

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

// process.env.NODE_ENV
switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

    default:
}

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// CSRF protection
app.use('/api', (req, res, next) => {
  if(/json/.test(req.get('Accept'))) {
    return next()
  }

  res.sendStatus(406);
});

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const posts = require('./routes/posts');

app.use('/api', posts);

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err,_req, res, _next) => {
  console.log(err.stack);
  res.sendStatus(500);
})



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Listening on port', port);
});
