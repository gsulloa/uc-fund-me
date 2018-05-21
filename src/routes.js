const KoaRouter = require('koa-router');
const projects = require('./routes/projects');

const router = new KoaRouter();

router.use('/projects', projects.routes());

module.exports = router;
