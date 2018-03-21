'use strict';

require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const order = require('./middlewares');
const passport = require('@jcmap/middleware-passport')();
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');

const app = module.exports = new Koa();

app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(normalizePaginationLimit());
app.use(normalizePaginationSkip());

app.use(route.post('/', passport.authJCT()));
app.use(route.post('/', order.createOrder()));

app.use(route.get('/', passport.authJCT()));
app.use(route.get('/', order.searchOrders()));

app.use(route.get('/:orderId', (ctx, _, next) => passport.authJCT()(ctx, next)));
app.use(route.get('/:orderId', order.fetchOrder()));

// 需要超级管理员权限才能更改订单
// app.use(route.put('/:orderId', (ctx, _, next) => passport.authJCT()(ctx, next)));
// app.use(route.put('/:orderId', order.updateOrder()));

// 订单记录不应该移除
// app.use(route.delete('/:orderId', (ctx, _, next) => passport.authJCT()(ctx, next)));
// app.use(route.delete('/:orderId', order.removeOrder()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`order service listen on port ${port}`)); // eslint-disable-line
}
