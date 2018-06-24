const faker = require('faker');
const { Contribution } = require('../../models');

/**
 * Generate an object which container attributes needed
 * to successfully create a contribution instance.
 * @param  {Object} props Properties to use for the contribution.
 * @return {Object}       An object to build the contribution from.
 */
const data = async (props = {}) => {
  const defaultProps = {
    amount: faker.random.number({ min: 1, max: 1000000 }),
  };
  return {
    ...defaultProps,
    ...props,
  };
};
/**
 * Generates a contribution instance from the properties provided.
 * @param  {Object} props Properties to use for the contribution.
 * @return {Object}       A contribution instance
 */
module.exports = async (props = {}) => Contribution.create(await data(props));
