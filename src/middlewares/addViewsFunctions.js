const formatAsCurrency = require('../utils/currency');
const moment = require('moment');

async function addViewsFunctions(ctx, next) {
  ctx.state.formatAsCurrency = formatAsCurrency;
  ctx.state.formatDate = dateTime => moment(dateTime).calendar();
  if (ctx.session.user) {
    ctx.state.currentUser = ctx.session.user;
    ctx.state.points = Math.floor(await ctx.orm.Contribution.sum(
      'amount',
      { where: { UserId: ctx.session.user.id } },
    ) * 0.005);
  }
  return next();
}


module.exports = addViewsFunctions;
