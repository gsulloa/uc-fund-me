const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('createReport', '/', async (ctx) => {
  const { project } = ctx.state;
  const { slug } = project;
  try {
    await project.update({ reported: true });
  } catch (e) {
    const photos = await project.getImages().map(image => image.name);
    return ctx.render('projects/show', {
      project,
      errors: e.errors.map(er => er.message),
      photos: photos.map(name => ctx.router.url('imageDownload', { name })),
      goIndexPath: ctx.router.url('projects'),
      createContributionPath: ctx.router.url('createContribution', { slug: ctx.params.slug }),
      createReportPath: ctx.router.url('createReport', { slug: ctx.params.slug }),
    });
  }
  return ctx.redirect(ctx.router.url('project', { slug }));
});

module.exports = router;
