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
const {
  LEVEL_0,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
} = require('@jcmap/constant-plan-levels');


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
app.use(route.post('/', middlewares.formatAndValidPayloadWhenCreateAndUpdate()));
app.use(route.post('/', middlewares.createPlan()));

app.use(route.get('/', middlewares.searchPlans()));

app.use(route.get(`/${LEVEL_0}`, middlewares.fetchPlanByLevel({ planLevel: LEVEL_0 })));
app.use(route.get(`/${LEVEL_1}`, middlewares.fetchPlanByLevel({ planLevel: LEVEL_1 })));
app.use(route.get(`/${LEVEL_2}`, middlewares.fetchPlanByLevel({ planLevel: LEVEL_2 })));
app.use(route.get(`/${LEVEL_3}`, middlewares.fetchPlanByLevel({ planLevel: LEVEL_3 })));
app.use(route.get('/:planId', middlewares.fetchPlanById()));

// app.use(route.put('/:planId', passportMiddlewares.authJCT()));
// app.use(route.put('/:planId', (ctx, _, next) => middlewares.formatAndValidPayloadWhenCreateAndUpdate()(ctx, next)));
// app.use(route.put('/:planId', middlewares.updatePlan()));

app.use(route.put('/:planId/level_default', passportMiddlewares.authJCT()));
app.use(route.put('/:planId/level_default', middlewares.markPlanAsLevelEnabled()));

app.use(route.delete('/:planId', passportMiddlewares.authJCT()));
app.use(route.delete('/:planId', middlewares.removePlan()));

app.use(route.post('/:planId/orders', passportMiddlewares.authJCT()));
app.use(route.post('/:planId/orders', middlewares.orderPlan()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`plan service listen on port ${port}`)); // eslint-disable-line
}
