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
const configOrganizationMemberMiddlewares = require('@jcmap/middleware-organization-member');


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
const organizationMemberMiddlewares = configOrganizationMemberMiddlewares(routeConfig);


app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', middlewares.beforeSearchOrganizationMembers()));
app.use(route.get('/', organizationMemberMiddlewares.searchOrganizationMembers()));

app.use(route.delete('/:organizationMemberId', passportMiddlewares.authJCT()));
app.use(route.delete('/:organizationMemberId', middlewares.beforeRemoveOrganizationMember()));
app.use(route.delete('/:organizationMemberId', organizationMemberMiddlewares.removeOrganizationMember()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`organization member service listen on port ${port}`)); // eslint-disable-line
}
