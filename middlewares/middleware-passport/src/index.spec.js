const Koa = require('koa');
const superagent = require('superagent');
const configPassport = require('.');
const http = require('http');


let app;


describe('passport() without config', function() {

  beforeEach(function() {
    setupServer();
  });

  // FIXME: fix test
  test('should work', async () => {
    try {
      const res = await superagent.get('http://localhost:3000');
    } catch (err) {
      expect(err.status).toBe(401);
    }
  });
});


describe('passport() without config', function () {

  beforeEach(function() {
    setupServer({
      userApiUri: 'http://example.com'
    });
  });

  // FIXME: fix test
  test('should work', async () => {
    try {
      await superagent.get('http://localhost:3000');
    } catch (err) {
      expect(err.status).toBe(401);
    }
  });
});


afterEach(function() {
  app.close();
});

function setupServer(options) {
  const instance = new Koa();


  const passport = configPassport(options);

  instance.use(async (ctx, next) => {
    await next();
  });
  instance.use(passport.authJCT());

  app = http.createServer(instance.callback());
  app.listen(process.env.PORT || 3000);
}
