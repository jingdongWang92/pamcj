require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const passport = require('@jcmap/middleware-passport')();
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);
const middlewares = require('./middlewares');


const app = module.exports = new Koa();


app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(normalizePaginationLimit());
app.use(normalizePaginationSkip());


const routeConfig = {
  sequelize,
};

app.use(route.post('/', passport.authJCT()));
app.use(route.post('/', middlewares.beforeCreateCartogramRoute(routeConfig)));
app.use(route.post('/', middlewares.createCartogramRoute(routeConfig)));

app.use(route.get('/', passport.authJCT()));
app.use(route.get('/', middlewares.searchCartogramRoutes(routeConfig)));

app.use(route.put('/:cartogramRouteId', (ctx, _, next) => passport.authJCT()(ctx, next)));
app.use(route.put('/:cartogramRouteId', middlewares.beforeUpdateCartogramRoute(routeConfig)));
app.use(route.put('/:cartogramRouteId', middlewares.updateCartogramRoute(routeConfig)));

app.use(route.delete('/:cartogramRouteId', (ctx, _, next) => passport.authJCT()(ctx, next)));
app.use(route.delete('/:cartogramRouteId', middlewares.beforeRemoveCartogramRoute(routeConfig)));
app.use(route.delete('/:cartogramRouteId', middlewares.removeCartogramRoute(routeConfig)));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`cartogram route service listen on port ${port}`));
}
