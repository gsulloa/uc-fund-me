const KoaRouter = require('koa-router');
const slugify = require('../utils/slugify');
const uuid = require('uuid/v4');
const fileStorage = require('../services/file-storage');
const searchEngine = require('../services/search-engine');
const Promise = require('bluebird');

const routes = new KoaRouter();

routes.get('projects', '/', async (ctx) => {
  let projects;
  if (ctx.query.q) {
    const projectsSearch = await searchEngine.search(ctx.query.q);
    projects = projectsSearch.hits;
  } else {
    projects = await ctx.orm.Project.findAll();
  }
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
    const project = await ctx.orm.Project.build({
      ...ctx.request.body.fields,
      UserId: ctx.session.user.id,
    });
    let { img } = ctx.request.body.files;
    if (!Array.isArray(img)) img = [img];
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
  const photos = await project.getImages().map(image => image.name);
  return ctx.render('projects/show', {
    project,
    photos: photos.map(name => ctx.router.url('imageDownload', { name })),
    goIndexPath: routes.url('projects'),
  });
});

module.exports = routes;
