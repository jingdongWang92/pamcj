require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const confitPassport = require('@jcmap/middleware-passport');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);
const configCartogramCollectionMiddlewares = require('./middlewares/cartogram-collection');
const configCartogramCollectionGeoJSONCommonMiddlewares = require('./middlewares/cartogram-collection-geojson/common');
const cartogramCollectionGeoJSONV2Middleware = require('./middlewares/cartogram-collection-geojson/v2');
const cartogramCollectionGeoJSONV3Middleware = require('./middlewares/cartogram-collection-geojson/v3');


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
const passportMiddlewares = confitPassport();
const cartogramCollectionMiddlewares = configCartogramCollectionMiddlewares(routeConfig);
const cartogramCollectionGeoJSONCommonMiddlewares = configCartogramCollectionGeoJSONCommonMiddlewares(routeConfig);


app.use(route.post('/', passportMiddlewares.authJCT()));
app.use(route.post('/', cartogramCollectionMiddlewares.authCreateCartogramCollection()));
app.use(route.post('/', cartogramCollectionMiddlewares.createCartogramCollection()));

app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', cartogramCollectionMiddlewares.searchCartogramCollections()));

app.use(route.get('/:cartogramCollectionId', passportMiddlewares.authJCT()));
app.use(route.get('/:cartogramCollectionId', cartogramCollectionMiddlewares.fetchCartogramCollection()));

app.use(route.put('/:cartogramCollectionId', passportMiddlewares.authJCT()));
app.use(route.put('/:cartogramCollectionId', cartogramCollectionMiddlewares.updateCartogramCollection()));

app.use(route.delete('/:cartogramCollectionId', passportMiddlewares.authJCT()));
app.use(route.delete('/:cartogramCollectionId', cartogramCollectionMiddlewares.removeCartogramCollection()));

app.use(route.get('/:cartogramCollectionId/geojson', passportMiddlewares.authJCT()));
app.use(route.get('/:cartogramCollectionId/geojson', cartogramCollectionGeoJSONCommonMiddlewares.prepareCartogramCollection()));
app.use(route.get('/:cartogramCollectionId/geojson', cartogramCollectionGeoJSONV2Middleware(routeConfig)));
app.use(route.get('/:cartogramCollectionId/geojson', cartogramCollectionGeoJSONV3Middleware(routeConfig)));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`cartogram collection service listen on port ${port}`)); // eslint-disable-line
}
