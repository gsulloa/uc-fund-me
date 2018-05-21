const KoaRouter = require('koa-router');

const routes = new KoaRouter();


routes.get('projects', '/', async (ctx) => {
  const projects = await ctx.orm.Project.findAll();
  return ctx.render('projects/index', {
    projects,
    projectPath: id => routes.url('project', { id }),
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
    return next();
  } catch (e) {
    console.log('create project error: ', e);
    return ctx.render('projects/new', {
      project: ctx.orm.Project.build(ctx.request.body),
      submitProjectPath: routes.url('createProject'),
      goIndexPath: routes.url('projects'),
    });
  }
});

routes.get('project', '/:id', async (ctx) => {
  const project = await ctx.orm.Project.findById(ctx.params.id);
  return ctx.render('projects/show', {
    project,
    goIndexPath: routes.url('projects'),
  });
});

module.exports = routes;
