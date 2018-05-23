const faker = require('faker');
const { Project } = require('../../models');

/**
 * Generate an object which container attributes needed
 * to successfully create a project instance.
 * @param  {Object} props Properties to use for the project.
 * @return {Object}       An object to build the project from.
 */
const data = async (props = {}) => {
  const defaultProps = {
    title: faker.lorem.words(1),
    description: faker.lorem.sentence(),
    goal: faker.random.number({ min: 1, max: 1000000 }),
    published: true,
  };
  return {
    ...defaultProps,
    ...props,
  };
};
/**
 * Generates a project instance from the properties provided.
 * @param  {Object} props Properties to use for the project.
 * @return {Object}       A project instance
 */
module.exports = async (props = {}) => Project.create(await data(props));
