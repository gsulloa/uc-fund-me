const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('index', '/', async ctx => ctx.render('index', {
  message: 'hi!',
}));

module.exports = router;
