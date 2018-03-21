require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const configPassportMiddlewares = require('@jcmap/middleware-passport');
const configMiddlewares = require('./middlewares');


const app = module.exports = new Koa();


app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());


const routeConfig = {
  gaodeKey: process.env.GAODE_KEY,
};
const passportMiddlewares = configPassportMiddlewares();
const middlewares = configMiddlewares(routeConfig);

app.use(route.get('/gaode/geocoding', passportMiddlewares.authJCT()));
app.use(route.get('/gaode/geocoding', middlewares.geocoding()));

app.use(route.get('/gaode/reverse-geocoding', passportMiddlewares.authJCT()));
app.use(route.get('/gaode/reverse-geocoding', middlewares.reverseGeocoding()));

app.use(route.get('/gaode/input-tips', passportMiddlewares.authJCT()));
app.use(route.get('/gaode/input-tips', middlewares.inputTips()));

app.use(route.get('/geocoding', passportMiddlewares.authJCT()));
app.use(route.get('/geocoding', middlewares.geocoding()));

app.use(route.get('/reverse-geocoding', passportMiddlewares.authJCT()));
app.use(route.get('/reverse-geocoding', middlewares.reverseGeocoding()));

app.use(route.get('/input-tips', passportMiddlewares.authJCT()));
app.use(route.get('/input-tips', middlewares.inputTips()));

if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`geocoding service listen on port ${port}`)); // eslint-disable-line
}
