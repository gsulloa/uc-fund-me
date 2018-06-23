const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('contribution', '/', async (ctx) => {
  const contributions = await ctx.orm.Contribution.findAll({
    where: {
      ProjectId: ctx.state.project.id,
    },
    include: [
      ctx.orm.User,
      ctx.orm.Project,
    ],
  });
  ctx.body = {
    contributions,
  };
});

router.post('createContribution', '/', async (ctx) => {
  try {
    const contribution = await ctx.orm.Contribution.create({
      amount: ctx.request.body.amount,
      UserId: ctx.session.user.id,
      ProjectId: ctx.state.project.id,
    });
    return ctx.redirect(ctx.router.url('project', { slug: ctx.state.project.slug }));
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
