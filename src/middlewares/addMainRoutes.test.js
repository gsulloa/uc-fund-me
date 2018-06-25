const addMainRoutes = require('./addMainRoutes');

describe('Adding main routes', () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      router: {
        url: route => route,
      },
      state: {},
      session: {},
      url: 'current',
    };
  });
  describe('if user signed in', () => {
    beforeEach(async () => {
      ctx.session = {
        user: true,
      };
      await addMainRoutes(ctx, () => {});
    });
    it('sign out path exist', () => {
      expect(ctx.state.signOutPath).toBe('signOut');
      expect(ctx.state.myContributionsPath).toBe('myContributions');
    });
    it('sign in and sign up path doesnt exist', () => {
      expect(ctx.state.signInPath).toBeUndefined();
      expect(ctx.state.signUpPath).toBeUndefined();
    });
  });
  describe('if user not signed in', () => {
    beforeEach(async () => {
      await addMainRoutes(ctx, () => {});
    });
    it('sign out path doesnt exist', () => {
      expect(ctx.state.signOutPath).toBeUndefined();
      expect(ctx.state.myContributionsPath).toBeUndefined();
    });
    it('sign in and sign up path exist', () => {
      expect(ctx.state.signInPath).toBe('signIn');
      expect(ctx.state.signUpPath).toBe('signUp');
    });
  });
  describe('always', () => {
    beforeEach(async () => {
      await addMainRoutes(ctx, () => {});
    });
    it('projects and new path exist', () => {
      expect(ctx.state.projectsPath).toBe('projects');
      expect(ctx.state.newProjectPath).toBe('newProject');
    });
    it('isActive works', () => {
      expect(ctx.state.isActive('current')).toBeTruthy();
      expect(ctx.state.isActive('not_current')).toBeFalsy();
    });
  });
});
