const KoaRouter = require('koa-router');

const routes = new KoaRouter();

routes.get('projects', '/', async (ctx) => {
  const projects = await ctx.orm.Project.findAll();
  return ctx.render('projects/index', {
    projects,
    projectPath: slug => routes.url('project', { slug }),
    newProjectPath: routes.url('newProject'),
  });
});

routes.get('newProject', '/new', async (ctx) => {
  const project = await ctx.orm.Project.build();
  return ctx.render('projects/new', {
    project,
    submitProjectPath: routes.url('createProject'),
    goIndexPath: routes.url('projects'),
  });
});

routes.post('createProject', '/', async (ctx, next) => {
  try {
    const project = await ctx.orm.Project.create(ctx.request.body);
    return ctx.redirect(routes.url('project', { slug: project.slug }));
  } catch (e) {
    console.log('create project error: ', e);
    return ctx.render('projects/new', {
      project: ctx.orm.Project.build(ctx.request.body),
      submitProjectPath: routes.url('createProject'),
      goIndexPath: routes.url('projects'),
    });
  }
});

routes.get('project', '/:slug', async (ctx) => {
  const project = await ctx.orm.Project.findOne({ where: { slug: ctx.params.slug } });
  return ctx.render('projects/show', {
    project,
    goIndexPath: routes.url('projects'),
  });
});

module.exports = routes;
