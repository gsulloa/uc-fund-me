const KoaRouter = require('koa-router');
const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

router.get('imageDownload', '/:name', async (ctx) => {
  try {
    ctx.body = await fileStorage.download(ctx.params.name);
    ctx.response.type = 'image/png';
  } catch (e) {
    console.log('error');
  }
});

module.exports = router;
