const formatAsCurrency = require('../utils/currency');

function addViewsFunctions(ctx, next) {
  ctx.state.formatAsCurrency = formatAsCurrency;
  if (ctx.session.user) ctx.state.currentUser = ctx.session.user;
  return next();
}

module.exports = addViewsFunctions;
