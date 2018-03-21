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
const configOrganizationInvitationMiddlewares = require('@jcmap/middleware-organization-invitation');
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
const organizationInvitationMiddlewares = configOrganizationInvitationMiddlewares(routeConfig);


app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', middlewares.searchOrganizations()));

app.use(route.post('/', passportMiddlewares.authJCT()));
app.use(route.post('/', middlewares.beforeCreateOrganization()));
app.use(route.post('/', middlewares.createOrganization()));


app.use(route.get('/:organizationId', passportMiddlewares.authJCT()));
app.use(route.get('/:organizationId', middlewares.fetchOrganization()));

app.use(route.put('/:organizationId', passportMiddlewares.authJCT()));
app.use(route.put('/:organizationId', middlewares.updateOrganization()));

app.use(route.delete('/:organizationId', passportMiddlewares.authJCT()));
app.use(route.delete('/:organizationId', middlewares.removeOrganization()));


app.use(route.get('/:organizationId/invitations', passportMiddlewares.authJCT()));
app.use(route.get('/:organizationId/invitations', middlewares.beforeSearchOrganizationInvitations()));
app.use(route.get('/:organizationId/invitations', organizationInvitationMiddlewares.searchOrganizationInvitations()));

app.use(route.post('/:organizationId/invitations', passportMiddlewares.authJCT()));
app.use(route.post('/:organizationId/invitations', middlewares.beforeCreateOrganizationInvitation()));
app.use(route.post('/:organizationId/invitations', organizationInvitationMiddlewares.createOrganizationInvitation()));

app.use(route.post('/:organizationId/invitations/:invitationId/accept', passportMiddlewares.authJCT()));
app.use(route.post('/:organizationId/invitations/:invitationId/accept', middlewares.beforeAcceptOrganizationInvitation()));
app.use(route.post('/:organizationId/invitations/:invitationId/accept', organizationInvitationMiddlewares.acceptOrganizationInvitation()));

app.use(route.post('/:organizationId/invitations/:invitationId/reject', passportMiddlewares.authJCT()));
app.use(route.post('/:organizationId/invitations/:invitationId/reject', middlewares.beforeRejectOrganizationInvitation()));
app.use(route.post('/:organizationId/invitations/:invitationId/reject', organizationInvitationMiddlewares.rejectOrganizationInvitation()));


app.use(route.get('/:organizationId/members', passportMiddlewares.authJCT()));
app.use(route.get('/:organizationId/members', middlewares.beforeSearchOrganizationMembers()));
app.use(route.get('/:organizationId/members', organizationMemberMiddlewares.searchOrganizationMembers()));

app.use(route.delete('/:organizationId/members/:userId', passportMiddlewares.authJCT()));
app.use(route.delete('/:organizationId/members/:userId', middlewares.beforeRemoveOrganizationMember()));
app.use(route.delete('/:organizationId/members/:userId', organizationMemberMiddlewares.removeOrganizationMember()));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`organization service listen on port ${port}`)); // eslint-disable-line
}
