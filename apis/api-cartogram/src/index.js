require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const cartogram = require('./middlewares');
const passport = require('@jcmap/middleware-passport')();
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);


const app = module.exports = new Koa();


app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(normalizePaginationLimit());
app.use(normalizePaginationSkip());


app.use(route.post('/', passport.authJCT()));
app.use(route.post('/', cartogram.authCreateCartogram({ sequelize })));
app.use(route.post('/', cartogram.createCartogram({ sequelize })));

app.use(route.get('/', passport.authJCT()));
app.use(route.get('/', cartogram.searchCartograms({ sequelize })));

app.use(route.get('/:cartogramId', (ctx, _, next) => passport.authJCT()(ctx, next)));
app.use(route.get('/:cartogramId', cartogram.fetchCartogram({ sequelize })));

app.use(route.put('/:cartogramId', (ctx, _, next) => passport.authJCT()(ctx, next)));
app.use(route.put('/:cartogramId', cartogram.updateCartogram({ sequelize })));

app.use(route.delete('/:cartogramId', (ctx, _, next) => passport.authJCT()(ctx, next)));
app.use(route.delete('/:cartogramId', cartogram.removeCartogram({ sequelize })));

app.use(route.post('/:cartogramId/duplicate', (ctx, _, next) => passport.authJCT()(ctx, next)));
app.use(route.post('/:cartogramId/duplicate', cartogram.duplicateCartogram({ sequelize })));

app.use(route.post('/:cartogramId/dumb-beacons', cartogram.batchCreateDumbBeacons({ sequelize })));
app.use(route.delete('/:cartogramId/dumb-beacons', cartogram.batchRemoveDumbBeacons({ sequelize })));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`cartogram service listen on port ${port}`)); // eslint-disable-line
}
