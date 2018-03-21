require('dotenv').config({ silent: true });
const Koa = require('koa');
const route = require('koa-route');
const authorize = require('./middlewares');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);


const app = module.exports = new Koa();


app.use(logger());
app.use(cors());
app.use(helmet());
app.use(bodyParser());


const routeConfig = {
  sequelize,
};
app.use(route.get('/', authorize.renderAuth(routeConfig)));
app.use(route.post('/', authorize.authDecision(routeConfig)));


if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`authorize service listen on port ${port}`)); // eslint-disable-line
}
