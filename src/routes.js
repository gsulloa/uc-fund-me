const KoaRouter = require('koa-router');
const projects = require('./routes/projects');
const sessions = require('./routes/sessions');

const addMainRoutes = require('./middlewares/addMainRoutes');

const router = new KoaRouter();

router.use(addMainRoutes);

router.use('/projects', projects.routes());
router.use('/', sessions.routes());


module.exports = router;
