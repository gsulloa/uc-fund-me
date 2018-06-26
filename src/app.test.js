const app = require('./app');

it('App must run', () => {
  expect(app.listen()).toBeTruthy();
});
