const KoaRouter = require('koa-router');
const slugify = require('../utils/slugify');
const uuid = require('uuid/v4');
const fileStorage = require('../services/file-storage');
const searchEngine = require('../services/search-engine');
const Promise = require('bluebird');
const moment = require('moment');
const contributions = require('./contributions');
const reports = require('./reports');

const routes = new KoaRouter();

routes.get('projects', '/', async (ctx) => {
  let projects;
  let options = {};
  const { q } = ctx.query;
  if (q) {
    const projectsSearch = await searchEngine.search(q);
    projects = projectsSearch.hits.map(p => p.id);
    options = {
      where: {
        id: {
          $in: projects,
        },
      },
    };
  }
  projects = await ctx.orm.Project.findAll({
    include: [ctx.orm.User, ctx.orm.Image, ctx.orm.Contribution],
    ...options,
  });
  projects = projects.map(project => ({
    ...project.dataValues,
    totalContributions: project.Contributions.reduce((prev, crt) => prev + crt.amount, 0),
  }));
  console.log(projects);
  const currentUser = ctx.session.user;
  let admin = false;
  if (currentUser) {
    admin = currentUser.isAdmin;
  }
  return ctx.render('projects/index', {
    projects,
    q,
    projectPath: slug => routes.url('project', { slug }),
    newProjectPath: routes.url('newProject'),
    admin,
    deletePath: slug => routes.url('delete-project', { slug }),
    approvePath: slug => routes.url('approve-project', { slug }),
  });
});

routes.get('projects', '/dashboard', async (ctx) => {
  if (!ctx.session.user.isAdmin) {
    ctx.redirect('/');
  }
  let projects;
  const options = { where: { reported: true } };
  const { q } = ctx.query;

  projects = await ctx.orm.Project.findAll({
    include: [ctx.orm.User, ctx.orm.Image, ctx.orm.Contribution],
    ...options,
  });
  projects = projects.map(project => ({
    ...project.dataValues,
    totalContributions: project.Contributions.reduce((prev, crt) => prev + crt.amount, 0),
  }));
  console.log(projects);
  const currentUser = ctx.session.user;
  let admin = false;
  if (currentUser) {
    admin = currentUser.isAdmin;
  }
  return ctx.render('projects/dashboard', {
    projects,
    q,
    projectPath: slug => routes.url('project', { slug }),
    newProjectPath: routes.url('newProject'),
    admin,
    deletePath: slug => routes.url('delete-project', { slug }),
    approvePath: slug => routes.url('approve-project', { slug }),
  });
});

routes.get('newProject', '/projects/new', async (ctx) => {
  const project = await ctx.orm.Project.build();
  return ctx.render('projects/new', {
    project,
    submitProjectPath: routes.url('createProject'),
    goIndexPath: routes.url('projects'),
  });
});

routes.post('createProject', '/projects', async (ctx, next) => {
  try {
    const project = await ctx.orm.Project.build({
      ...ctx.request.body.fields,
      UserId: ctx.session.user.id,
    });
    let { img } = ctx.request.body.files;
    if (!Array.isArray(img)) img = img.size > 0 ? [img] : [];
    const imagePromises = img.map(async (file) => {
      const filename = file.name.substr(0, file.name.length - 4);
      const ext = file.name.substr(file.name.length - 4);
      // eslint-disable-next-line no-param-reassign
      file.name = `${slugify(filename)}-${uuid()}${ext}`;
      await fileStorage.upload(file);
      return file.name;
    });
    // Await to all images are uploaded before save the project
    const imagesNames = await Promise.all(imagePromises);
    await project.save();
    // eslint-disable-next-line
    const images = imagesNames.map(async (name) => {
      return ctx.orm.Image.create({ name, ProjectId: project.id });
    });
    await Promise.all(images);
    return ctx.redirect(routes.url('project', { slug: project.slug }));
  } catch (e) {
    return ctx.render('projects/new', {
      project: ctx.orm.Project.build(ctx.request.body),
      errors: e.errors.map(er => er.message),
      submitProjectPath: routes.url('createProject'),
      goIndexPath: routes.url('projects'),
    });
  }
});

routes.get('project', '/projects/:slug', async (ctx) => {
  let project = await ctx.orm.Project.findOne({
    where: { slug: ctx.params.slug },
    include: [ctx.orm.User, ctx.orm.Contribution],
  });
  const photos = await project.getImages().map(image => image.name);
  project = {
    ...project.dataValues,
    totalContributions: project.Contributions.reduce((prev, crt) => prev + crt.amount, 0),
  };
  return ctx.render('projects/show', {
    project,
    photos: photos.map(name => ctx.router.url('imageDownload', { name })),
    goIndexPath: routes.url('projects'),
    createContributionPath: ctx.router.url('createContribution', { slug: ctx.params.slug }),
    createReportPath: ctx.router.url('createReport', { slug: ctx.params.slug }),
  });
});

routes.post('delete-project', '/projects/:slug/delete', async (ctx, next) => {
  const currentUser = ctx.session.user;
  if (currentUser.isAdmin) {
    const project = await ctx.orm.Project.findOne({ where: { slug: ctx.params.slug } });
    try {
      project.destroy();
      ctx.redirect('/');
    } catch (e) {
      ctx.throw(404, e.errors);
    }
    return;
  }
  // ctx.redirect()
  ctx.throw(401);
});

routes.post('approve-project', '/project/:slug/approve', async (ctx, next) => {
  const currentUser = ctx.session.user;
  if (currentUser.isAdmin) {
    const project = await ctx.orm.Project.findOne({ where: { slug: ctx.params.slug } });
    try {
      project.reported = false;
      project.save();
      ctx.redirect('/');
    } catch (e) {
      ctx.throw(404, e.errors);
    }
    return;
  }
  // ctx.redirect()
  ctx.throw(401);
});

routes.use('/projects/:slug/contributions', async (ctx, next) => {
  ctx.state.project = await ctx.orm.Project.findOne({
    where: { slug: ctx.params.slug },
    include: [{
      model: ctx.orm.User,
    }],
  });
  return next();
}, contributions.routes());

routes.use('/projects/:slug/reports', async (ctx, next) => {
  ctx.state.project = await ctx.orm.Project.findOne({
    where: { slug: ctx.params.slug },
    include: [{
      model: ctx.orm.User,
    }],
  });
  return next();
}, reports.routes());

module.exports = routes;
