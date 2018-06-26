const searchEngine = require('./search-engine');
const Promise = require('bluebird');

describe('search engine service', () => {
  it('create search engine works', () => {
    expect(searchEngine).toBeTruthy();
  });
  describe('functions', () => {
    it('complete cycle', async () => {
      const searchTest = '36601cc5-4226-40bc-a05d-fbfe3eafee22';
      expect(await searchEngine.addObject({ searchTest })).toBeUndefined();
      await new Promise(res => setTimeout(res, 5000));
      const search = await searchEngine.search(searchTest);
      expect(search.hits.length).toBeGreaterThanOrEqual(1);
      expect(await searchEngine.removeObject(search.hits[0].objectID));
    }, 20000);
  });
});
