const KoaRouter = require('koa-router');
const projects = require('./routes/projects');
const sessions = require('./routes/sessions');
const images = require('./routes/images');

const addMainRoutes = require('./middlewares/addMainRoutes');
const addViewsFunctions = require('./middlewares/addViewsFunctions');

const router = new KoaRouter();

router.use(addMainRoutes, addViewsFunctions);

router.use('/projects', projects.routes());
router.use('/images', images.routes());
router.use('/', sessions.routes());


module.exports = router;
