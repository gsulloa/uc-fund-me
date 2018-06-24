const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('contribution', '/', async ctx => ctx.redirect(ctx.router.url('project', { slug: ctx.state.project.slug })));

router.post('createContribution', '/', async (ctx) => {
  try {
    await ctx.orm.Contribution.create({
      amount: ctx.request.body.amount,
      UserId: ctx.session.user.id,
      ProjectId: ctx.state.project.id,
    });
  } catch (e) {
    const { project } = ctx.state;
    const photos = await project.getImages().map(image => image.name);
    return ctx.render('projects/show', {
      project,
      errors: e.errors.map(er => er.message),
      photos: photos.map(name => ctx.router.url('imageDownload', { name })),
      goIndexPath: ctx.router.url('projects'),
      createContributionPath: ctx.router.url('createContribution', { slug: ctx.params.slug }),
    });
  }
  return ctx.redirect(ctx.router.url('project', { slug: ctx.state.project.slug }));
});

module.exports = router;
