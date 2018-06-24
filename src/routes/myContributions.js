const KoaRouter = require('koa-router');
const moment = require('moment');

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
    order: [['createdAt', 'DESC']],
  });
  ctx.body = contributions;
  return ctx.render('myContributions/index', {
    contributions,
    projectPath: slug => ctx.router.url('project', { slug }),
  });
});

module.exports = router;
