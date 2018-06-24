const formatAsCurrency = require('../utils/currency');
const moment = require('moment');

function addViewsFunctions(ctx, next) {
  ctx.state.formatAsCurrency = formatAsCurrency;
  ctx.state.formatDate = dateTime => moment(dateTime).calendar();
  if (ctx.session.user) ctx.state.currentUser = ctx.session.user;
  return next();
}

module.exports = addViewsFunctions;
