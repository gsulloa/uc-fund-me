
const sessionAuth = require('./sessionAuth');

describe('Session authorization', () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      router: {
        url: path => path,
      },
      session: {},
    };
  });
  describe('signed in', () => {
    beforeEach(() => {
      ctx = {
        ...ctx,
        session: {
          user: true,
        },
        redirect: jest.fn(),
      };
    });
    it('redirect if go signIn', async () => {
      ctx.url = 'signIn';
      await sessionAuth(ctx, () => {});
      return expect(ctx.redirect.mock.calls.length).toBe(1);
    });
    it('redirect if go signUp', async () => {
      ctx.url = 'signUp';
      await sessionAuth(ctx, () => {});
      return expect(ctx.redirect.mock.calls.length).toBe(1);
    });
    it('do not redirect if go project new', async () => {
      ctx.url = 'newProject';
      await sessionAuth(ctx, () => {});
      return expect(ctx.redirect.mock.calls.length).toBe(0);
    });
  });
  describe('not signed in', () => {
    beforeEach(() => {
      ctx = {
        ...ctx,
        redirect: jest.fn(),
      };
    });
    it('do not redirect if go signIn', async () => {
      ctx.url = 'signIn';
      await sessionAuth(ctx, () => {});
      return expect(ctx.redirect.mock.calls.length).toBe(0);
    });
    it('do not redirect if go signUp', async () => {
      ctx.url = 'signUp';
      await sessionAuth(ctx, () => {});
      return expect(ctx.redirect.mock.calls.length).toBe(0);
    });
    it('redirect if go project new', async () => {
      ctx.url = 'newProject';
      await sessionAuth(ctx, () => {});
      return expect(ctx.redirect.mock.calls.length).toBe(1);
    });
  });
});
