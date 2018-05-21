const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.delete('signOut', 'sign-out', async (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('signIn'));
});

router.use(async (ctx, next) => {
  if (ctx.session.user) {
    ctx.redirect(ctx.router.url('projects'));
  }
  await next();
});

router.get('signIn', 'sign-in', async (ctx) => {
  await ctx.render('sessions/new', {
    email: '',
    signInPath: router.url('signInDo'),
    signUpPath: router.url('signUp'),
    layout: 'sessions/layout',
  });
});

router.post('signInDo', 'sign-in', async (ctx) => {
  const { email, password } = ctx.request.body;
  try {
    const user = await ctx.orm.User.find({ where: { email } });
    const validPassword = await user.checkPassword(password);
    if (validPassword) {
      ctx.session.user = user;
      ctx.redirect(ctx.router.url('projects'));
    }
    throw new Error('error');
  } catch (error) {
    await ctx.render('sessions/new', {
      email,
      signInPath: router.url('signInDo'),
      signUpPath: router.url('signUp'),
      error: 'Nombre de usuario y/o contraseña incorrectos',
      layout: 'sessions/layout',
    });
  }
});

router.get('signUp', 'sign-up', async (ctx) => {
  const user = ctx.orm.User.build();
  return ctx.render('sessions/signUp', {
    user,
    signUpPath: router.url('signUpDo'),
    signInPath: router.url('signIn'),
    layout: 'sessions/layout',
  });
});

router.post('signUpDo', 'sign-up', async (ctx) => {
  const user = ctx.orm.User.build(ctx.request.body);
  if (ctx.request.body.password !== ctx.request.body.passwordR) {
    return ctx.render('sessions/signUp', {
      user,
      signUpPath: router.url('signUpDo'),
      signInPath: router.url('signIn'),
      layout: 'sessions/layout',
    });
  }
  await user.save({ fields: ['email', 'password', 'name'] });
  ctx.session.user = user;
  return ctx.redirect(ctx.router.url('projects'));
});

module.exports = router;
