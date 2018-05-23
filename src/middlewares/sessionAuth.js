function sessionAuth(ctx, next) {
  const config = {
    notsigned: {
      routes: [
        ctx.router.url('newProject'),
      ],
      redirect: ctx.router.url('signIn'),
    },
    signed: {
      routes: [
        ctx.router.url('signIn'),
        ctx.router.url('signUp'),
      ],
      redirect: ctx.router.url('projects'),
    },
  };
  const status = ctx.session.user ? 'signed' : 'notsigned';
  if (config[status].routes.includes(ctx.url)) return ctx.redirect(config[status].redirect);
  return next();
}

module.exports = sessionAuth;
