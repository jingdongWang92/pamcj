'use strict';

require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const middle = require('./middlewares');
const passport = require('@jcmap/middleware-passport')();
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');

const app = module.exports = new Koa();

app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());


app.use(route.get('/zhubajie', middle.getAccessToken()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`authorization service listen on port ${port}`)); // eslint-disable-line
}
