const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.delete('signOut', 'sign-out', async (ctx) => {
  ctx.session = null;
  router.redirect(ctx.router.url('sessionNew'));
});

router.use(async (ctx, next) => {
  if (ctx.state.currentUser) {
    router.redirect('/');
  }
  await next();
});

router.get('signIn', 'sign-in', async (ctx) => {
  await ctx.render('sessions/new', {
    email: '',
    signInPath: router.url('signInDo'),
    signUpPath: router.url('signUp'),
  });
});

router.post('signInDo', 'sign-in', async (ctx) => {
  const { email, password } = ctx.request.body;
  try {
    const user = await ctx.orm.User.find({ where: { email } });

    const validPassword = await user.checkPassword(password);
    if (validPassword) {
      ctx.session.userId = user.id;
      router.redirect('projects');
    }
    throw new Error('error');
  } catch (error) {
    await ctx.render('sessions/new', {
      email,
      signInPath: router.url('signInDo'),
      signUpPath: router.url('signUp'),
      error: 'Nombre de usuario y/o contraseña incorrectos',
    });
  }
});

router.get('signUp', 'sign-up', async (ctx) => {
  const user = ctx.orm.User.build();
  return ctx.render('sessions/signUp', {
    user,
    signUpPath: router.url('signUpDo'),
    signInPath: router.url('signIn'),
  });
});

router.post('signUpDo', 'sign-up', async (ctx) => {
  const user = ctx.orm.User.build(ctx.request.body);
  if (ctx.request.body.password !== ctx.request.body.passwordR) {
    return ctx.render('sessions/signUp', {
      user,
      signUpPath: router.url('signUpDo'),
      signInPath: router.url('signIn'),
    });
  }
  await user.save({ fields: ['email', 'password', 'name'] });
  ctx.session.userId = user.id;
  return ctx.redirect(ctx.router.url('projects'));
});

module.exports = router;
