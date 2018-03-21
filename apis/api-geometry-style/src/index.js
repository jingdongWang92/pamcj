require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const configMiddlewares = require('./middlewares');
const configPassportMiddlewares = require('@jcmap/middleware-passport');
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


const routeConfig = {
  sequelize,
};
const passportMiddlewares = configPassportMiddlewares();
const middlewares = configMiddlewares(routeConfig);

app.use(route.post('/', passportMiddlewares.authJCT()));
app.use(route.post('/', middlewares.createGeometryStyle()));

app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', middlewares.searchGeometryStyles()));

app.use(route.get('/:geometryStyleId', passportMiddlewares.authJCT()));
app.use(route.get('/:geometryStyleId', middlewares.fetchGeometryStyle()));

app.use(route.put('/:geometryStyleId', passportMiddlewares.authJCT()));
app.use(route.put('/:geometryStyleId', middlewares.updateGeometryStyle()));

app.use(route.delete('/:geometryStyleId', passportMiddlewares.authJCT()));
app.use(route.delete('/:geometryStyleId', middlewares.removeGeometryStyle()));

if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`geometry style service listen on port ${port}`)); // eslint-disable-line
}
