require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
const configMiddlewares = require('./middlewares');
const configPassportMiddlewares = require('@jcmap/middleware-passport');
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
app.use(route.post('/', middlewares.createLayer()));

app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', middlewares.searchLayers()));

app.use(route.get('/:layerId', passportMiddlewares.authJCT()));
app.use(route.get('/:layerId', middlewares.fetchLayer()));

app.use(route.put('/:layerId', passportMiddlewares.authJCT()));
app.use(route.put('/:layerId', middlewares.updateLayer()));

app.use(route.delete('/:layerId', passportMiddlewares.authJCT()));
app.use(route.delete('/:layerId', middlewares.removeLayer()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`layer service listen on port ${port}`));
}
