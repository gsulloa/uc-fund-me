const slugify = require('./slugify');

describe('utils slugify', () => {
  it('space', () => {
    expect(slugify('slug this')).toBe('slug-this');
  });
  it('accent', () => {
    expect(slugify('slúg thís')).toBe('slug-this');
  });
  it('upper cases', () => {
    expect(slugify('SluG ThIs')).toBe('slug-this');
  });
});
