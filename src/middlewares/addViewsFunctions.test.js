/* eslint-disable */
const addViewsFunctions = require('./addViewsFunctions');
const formatAsCurrency = require('../utils/currency');

describe('Adding views functions', () => {
  let ctx;
  beforeEach(async () => {
    ctx = {
      state: {},
    };
    await addViewsFunctions(ctx, () => {});
  })
  it('format as currency works', () => {
    const value = 5000;
    expect(ctx.state.formatAsCurrency(value)).toBe(formatAsCurrency(value));
  })
})

/* eslint-enable */
