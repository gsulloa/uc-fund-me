const fs = require('fs');
const path = require('path');

function migrationTest(filename, migration) {
  describe(`${filename} required functions`, () => {
    it('should has up', () => {
      expect(migration.up).toBeInstanceOf(Function);
    });
    it('should has down', () => {
      expect(migration.down).toBeInstanceOf(Function);
    });
  });
}

const basename = path.basename(module.filename);
const basedir = `${__dirname}/../../migrations`;

fs
  .readdirSync(basedir)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    migrationTest(file, require(`${basedir}/${file}`)); // eslint-disable-line
  });
