function sessionAuth(ctx, next) {
  const config = {
    notsigned: {
      routes: [
        ctx.router.url('newProject'),
        ctx.router.url('myContributions'),
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
  console.log(ctx.url, config[status].routes)
  if (config[status].routes.includes(ctx.url)) return ctx.redirect(config[status].redirect);
  return next();
}

module.exports = sessionAuth;
