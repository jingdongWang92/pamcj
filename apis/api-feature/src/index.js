require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const configPassportMiddlewares = require('@jcmap/middleware-passport');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
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
};
const passportMiddlewares = configPassportMiddlewares();
const middlewares = configMiddlewares(routeConfig);

app.use(route.post('/', passportMiddlewares.authJCT()));
app.use(route.post('/', middlewares.createFeature()));

app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', middlewares.searchFeatures()));

app.use(route.get('/:featureUUID', passportMiddlewares.authJCT()));
app.use(route.get('/:featureUUID', middlewares.fetchFeature()));

app.use(route.put('/:featureUUID', passportMiddlewares.authJCT()));
app.use(route.put('/:featureUUID', middlewares.updateFeature()));

app.use(route.delete('/:featureUUID', passportMiddlewares.authJCT()));
app.use(route.delete('/:featureUUID', middlewares.removeFeature()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`feature service listen on port ${port}`));
}
