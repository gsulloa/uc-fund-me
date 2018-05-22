const searchEngine = require('./search-engine');
const uuid = require('uuid/v4');
const Promise = require('bluebird');
/* eslint-disable */

describe('search engine service', () => {
  it('create search engine works', () => {
    expect(searchEngine).toBeTruthy();
  })
  describe('functions', () => {
    it('complete cycle', async () => {
      let guid = uuid();
      const title = `test-${guid}`;
      expect(await searchEngine.addObject({ title })).toBeUndefined();
      await new Promise((res) => setTimeout(res, 5000))
      const search = await searchEngine.search(title);
      expect(search.hits.length).toBe(1);
      expect(await searchEngine.removeObject(search.hits[0].objectID));
    }, 20000)
  })
})

/* eslint-enable */
