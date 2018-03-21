require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const normalizePaginationLimit = require('@jcnetwork/normalize-pagination-limit-middleware');
const normalizePaginationSkip = require('@jcnetwork/normalize-pagination-skip-middleware');
const ms = require('ms');
const configPassportMiddlewares = require('@jcmap/middleware-passport');
const configMiddlewares = require('./middlewares');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);


const jwtSecret = process.env.JWT_SECRET;
const defaultJwtConfig = {
  algorithm: process.env.JWT_ALGORITHM,
  expiresIn: ms(process.env.JWT_EXPIRES_IN), // 转换为毫秒
  notBefore: ms(process.env.JWT_NOT_BEFORE || 0), // 转换为毫秒
};
const immortalEmails = (process.env.IMMORTAL_EMAIL_LIST || '')
    .split(',')
    .map(email => email.trim());
const sendRegisterEmail = !!process.env.SEND_REGISTER_EMAIL;
const registrationConfirmUrl = process.env.REGISTRATION_CONFIRM_URL || process.env.REGISTRATION_CONFIRM;
const passwordResetUrl = process.env.PASSWORD_RESET_URL;


const app = module.exports = new Koa();


app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(normalizePaginationLimit());
app.use(normalizePaginationSkip());


const routeConfig = {
  sequelize,
  jwtSecret,
  defaultJwtConfig,
  immortalEmails,
  sendRegisterEmail,
  registrationConfirmUrl,
  passwordResetUrl,
};
const passportMiddlewares = configPassportMiddlewares();
const middlewares = configMiddlewares(routeConfig);

app.use(route.post('/', middlewares.createUser()));

app.use(route.get('/', passportMiddlewares.authJCT()));
app.use(route.get('/', middlewares.searchUsers()));

app.use(route.get('/self', middlewares.fetchSelf()));

app.use(route.put('/self/password-change', passportMiddlewares.authJCT()));
app.use(route.put('/self/password-change', middlewares.changePassword()));

app.use(route.put('/self/password-reset', passportMiddlewares.authJCT()));
app.use(route.put('/self/password-reset', middlewares.resetPassword()));

app.use(route.put('/self/password-forgot', middlewares.forgotPassword()));

app.use(route.get('/:userId', passportMiddlewares.authJCT()));
app.use(route.get('/:userId', middlewares.fetchUser()));

app.use(route.put('/:userId', passportMiddlewares.authJCT()));
app.use(route.put('/:userId', middlewares.updateUser()));

app.use(route.post('/:userId/register-email', middlewares.sendRegisterEmail()));

app.use(route.post('/:userId/impersonate', passportMiddlewares.authJCT()));
app.use(route.post('/:userId/impersonate', middlewares.impersonateUser()));

app.use(route.put('/:userId', passportMiddlewares.authJCT()));
app.use(route.put('/:userId/email-mark-verified', middlewares.markUserEmailVerified()));

app.use(route.delete('/:userId', passportMiddlewares.authJCT()));
app.use(route.delete('/:userId', middlewares.removeUser()));


if (!module.parent) {
  [
    'MYSQL_URI',
    'JWT_SECRET',
    'JWT_ALGORITHM',
    'JWT_EXPIRES_IN',
    'REGISTRATION_CONFIRM',
    'PASSWORD_RESET_URL',
  ].forEach(envKey => {
    if (!process.env[envKey]) {
      throw new Error(`enviroment variable ${envKey} does not exists`);
    }
  });


  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`user service listen on port ${port}`)); // eslint-disable-line
}
