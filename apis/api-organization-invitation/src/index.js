require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);
const configMiddlewares = require('./middlewares');
const configPassportMiddlewares = require('@jcmap/middleware-passport');
const configOrganizationInvitationMiddlewares = require('@jcmap/middleware-organization-invitation');


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
const organizationInvitationMiddlewares = configOrganizationInvitationMiddlewares(routeConfig);


app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', middlewares.beforeSearchOrganizationInvitations()));
app.use(route.get('/', organizationInvitationMiddlewares.searchOrganizationInvitations()));

app.use(route.post('/', passportMiddlewares.authJCT()));
app.use(route.post('/', middlewares.beforeCreateOrganizationInvitation()));
app.use(route.post('/', organizationInvitationMiddlewares.createOrganizationInvitation()));

app.use(route.post('/:organizationInvitationId/accept', passportMiddlewares.authJCT()));
app.use(route.post('/:organizationInvitationId/accept', middlewares.beforeAcceptOrganizationInvitation()));
app.use(route.post('/:organizationInvitationId/accept', organizationInvitationMiddlewares.acceptOrganizationInvitation()));

app.use(route.post('/:organizationInvitationId/rejct', passportMiddlewares.authJCT()));
app.use(route.post('/:organizationInvitationId/rejct', middlewares.beforeRejectOrganizationInvitation()));
app.use(route.post('/:organizationInvitationId/rejct', organizationInvitationMiddlewares.rejectOrganizationInvitation()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`organization invitation service listen on port ${port}`));
}
