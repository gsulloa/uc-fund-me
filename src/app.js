const Koa = require('koa');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
const render = require('koa-ejs');
const koaFlashMessage = require('koa-flash-message').default;
const override = require('koa-override-method');
const koaStatic = require('koa-static');
const orm = require('./models');
const routes = require('./routes');
const session = require('koa-session');
const path = require('path');

// App constructor
const app = new Koa();

const developmentMode = app.env === 'development';

// expose ORM through context's prototype
app.context.orm = orm;

app.keys = [
  'these secret keys are used to sign HTTP cookies',
  'to make sure only this app can generate a valid one',
  'and thus preventing someone just writing a cookie',
  'saying he is logged in when it\'s really not',
];

/**
 * Middlewares
 */

// expose running mode in ctx.state
app.use((ctx, next) => {
  ctx.state.env = ctx.app.env;
  return next();
});

// log requests
app.use(koaLogger());

// parse request body
app.use(koaBody({
  multipart: true,
  keepExtensions: true,
}));

// expose a session hash to store information across requests from same client
app.use(session({
  maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
  signed: process.env.NODE_ENV !== 'test',
}, app));


// Configure EJS views
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'html.ejs',
  cache: !developmentMode,
});

// flash messages support
app.use(koaFlashMessage);

app.use(koaStatic(path.join(__dirname, 'assets'), {}));

app.use((ctx, next) => {
  ctx.request.method = override.call(ctx, ctx.request.body);
  return next();
});

app.use(routes.routes());

module.exports = app;
