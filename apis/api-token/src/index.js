require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const token = require('./middlewares');
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

app.use(route.post('/', token.grantAuthorizationCode()));
app.use(route.post('/', token.grantResourceOwnerPasswordCredentials()));
app.use(route.post('/', token.grantClientCredentials()));
app.use(route.post('/', token.grantRefreshToken()));
app.use(route.post('/', token.fetchToken()));

app.use(route.post('/zhubajie', token.fetchTokenByZBJOponid()));


if (!module.parent) {
  [
    'MYSQL_URI',
    'JWT_SECRET',
    'JWT_ALGORITHM',
    'JWT_EXPIRES_IN',
    'JWT_NOT_BEFORE',
  ].forEach(envKey => {
    if (!process.env[envKey]) {
      throw new Error(`enviroment variable ${envKey} does not exists`);
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`token service listen on port ${port}`)); // eslint-disable-line
}
