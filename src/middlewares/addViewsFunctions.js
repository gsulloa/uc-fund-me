const formatAsCurrency = require('../utils/currency');

function addViewsFunctions(ctx, next) {
  ctx.state.formatAsCurrency = formatAsCurrency;
  return next();
}

module.exports = addViewsFunctions;
