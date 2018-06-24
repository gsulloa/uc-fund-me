function addMainRoutes(ctx, next) {
  if (!ctx.session.user) {
    ctx.state.signInPath = ctx.router.url('signIn');
    ctx.state.signUpPath = ctx.router.url('signUp');
  } else {
    ctx.state.signOutPath = ctx.router.url('signOut');
    ctx.state.myContributionsPath = ctx.router.url('myContributions');
  }
  ctx.state.projectsPath = ctx.router.url('projects');
  ctx.state.newProjectPath = ctx.router.url('newProject');

  ctx.state.isActive = route => route === ctx.url;
  return next();
}

module.exports = addMainRoutes;
