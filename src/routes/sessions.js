const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.delete('sessionDestroy', 'sign-out', async (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('sessionNew'));
});

router.use(async (ctx, next) => {
  if (ctx.state.currentUser) {
    ctx.redirect('/');
  }
  await next();
});

router.get('sessionNew', 'sign-in', async (ctx) => {
  await ctx.render('sessions/new', {
    createSessionPath: ctx.router.url('sessionCreate'),
  });
});

router.post('sessionCreate', 'sign-in', async (ctx) => {
  const { email, password } = ctx.request.body;
  try {
    const user = await ctx.orm.User.find({ where: { email } });

    const validPassword = await user.checkPassword(password);
    if (validPassword) {
      ctx.session.userId = user.id;
      ctx.redirect('/');
    }
    throw new Error('error');
  } catch (error) {
    await ctx.render('sessions/new', {
      email,
      createSessionPath: router.url('sessionCreate'),
      error: 'Nombre de usuario y/o contraseña incorrectos',
    });
  }
});

module.exports = router;
