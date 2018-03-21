require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
const configPassportMiddlewares = require('@jcmap/middleware-passport');
const configMiddlewares = require('./middlewares');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);


const app = module.exports = new Koa();


app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(normalizePaginationLimit());
app.use(normalizePaginationSkip());


const routeConfig = {
  sequelize,
  storageApiUri: process.env.STORAGE_API_URI || 'http://api-storage',
};
const passportMiddlewares = configPassportMiddlewares();
const middlewares = configMiddlewares(routeConfig);

app.use(route.get('/:cartogramId', passportMiddlewares.authJCT()));
app.use(route.get('/:cartogramId', middlewares.fetchCartogramGeoreference()));

app.use(route.put('/:cartogramId', passportMiddlewares.authJCT()));
app.use(route.put('/:cartogramId', middlewares.updateCartogramGeoreference()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`cartogram georeference service listen on port ${port}`));
}
