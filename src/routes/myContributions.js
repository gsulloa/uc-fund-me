const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('myContributions', '/', async (ctx) => {
  const contributions = await ctx.orm.Contribution.findAll({
    where: {
      UserId: ctx.session.user.id,
    },
    include: [{
      model: ctx.orm.Project,
      attributes: ['title', 'slug'],
    }],
  });
  ctx.body = contributions;
});

module.exports = router;
