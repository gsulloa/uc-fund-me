const formatAsCurrency = require('../utils/currency');
const moment = require('moment');

async function addViewsFunctions(ctx, next) {
  ctx.state.formatAsCurrency = formatAsCurrency;
  ctx.state.formatDate = dateTime => moment(dateTime).calendar();
  if (ctx.session.user) {
    ctx.state.currentUser = ctx.session.user;

    const points = await ctx.orm.Contribution.sum(
      'amount',
      { where: { UserId: ctx.session.user.id } },
    );

    ctx.state.points = Number.isNaN(points) ? 0 : Math.floor(points * 0.005);
  }
  return next();
}


module.exports = addViewsFunctions;
