const KoaRouter = require('koa-router');
const projects = require('./routes/projects');
const sessions = require('./routes/sessions');

const router = new KoaRouter();

router.use('/projects', projects.routes());
router.use('/', sessions.routes());

module.exports = router;
