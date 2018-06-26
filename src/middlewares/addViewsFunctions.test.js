/* eslint-disable */
const addViewsFunctions = require('./addViewsFunctions');
const formatAsCurrency = require('../utils/currency');
const orm = require('../models');

describe('Adding views functions', () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      state: {},
      session: {},
      orm: orm,
    };
  })
  it('format as currency works', async () => {
    await addViewsFunctions(ctx, () => {});
    const value = 5000;
    expect(ctx.state.formatAsCurrency(value)).toBe(formatAsCurrency(value));
  })
  describe('user signed in', () => {
    beforeEach(async () => {
      ctx.session.user = true;
      ctx.session.user.id = 0;
      await addViewsFunctions(ctx, () => {});
    })
    it('user should be exposed', () => {
      expect(ctx.state.currentUser).toBeTruthy();
    })
  })
  describe('user not signed in', () => {
    beforeEach(async () => {
      await addViewsFunctions(ctx, () => {});
    })
    it('user shouldnt be exposed', () => {
      expect(ctx.state.currentUser).toBeFalsy();
    })
  })
})

/* eslint-enable */
