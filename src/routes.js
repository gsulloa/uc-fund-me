const KoaRouter = require('koa-router');
const projects = require('./routes/projects');
const contributions = require('./routes/myContributions');
const sessions = require('./routes/sessions');
const images = require('./routes/images');
const reports = require('./routes/reports');

const addMainRoutes = require('./middlewares/addMainRoutes');
const addViewsFunctions = require('./middlewares/addViewsFunctions');
const sessionAuth = require('./middlewares/sessionAuth');

const router = new KoaRouter();

router.use(addMainRoutes, addViewsFunctions, sessionAuth);

router.use(projects.routes());
router.use('/images', images.routes());
router.use(contributions.routes());
router.use(sessions.routes());

module.exports = router;
