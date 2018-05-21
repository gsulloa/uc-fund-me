const KoaRouter = require('koa-router');

const routes = new KoaRouter();

routes.get('projects', '/', async (ctx) => {
  const projects = await ctx.orm.Project.findAll();
  return ctx.render('projects/index', {
    projects,
    projectUrl: id => routes.url('project', { id }),
  });
});

routes.get('project', '/:id', async (ctx) => {
  const project = await ctx.orm.Project.findById(ctx.params.id);
  return ctx.render('projects/show', {
    project,
    goIndex: routes.url('projects'),
  });
});

module.exports = routes;
