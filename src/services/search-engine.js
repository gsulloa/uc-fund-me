const algoliasearch = require('algoliasearch');
const Promise = require('bluebird');
const { applicationId, apiKey, indexName } = require('../config/algolia');

class SearchEngine {
  constructor() {
    const client = algoliasearch(applicationId, apiKey);
    this.index = client.initIndex(indexName);
  }
  addObject(object) {
    this.index.addObject(object);
  }
  addObjects(objects) {
    this.index.addObjects(objects);
  }

  search(query) {
    return new Promise((res, rej) => {
      this.index.search({
        query,
      }, (err, content) => {
        if (err) rej(err);
        res(content);
      });
    });
  }
}

module.exports = new SearchEngine();
