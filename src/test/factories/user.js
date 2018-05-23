const faker = require('faker');
const { User } = require('../../models');

/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 * @param  {Object} props Properties to use for the user.
 * @return {Object}       An object to build the user from.
 */
const data = async (props = {}) => {
  const defaultProps = {
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.internet.password(10),
    isAdmin: false,
  };
  return {
    ...defaultProps,
    ...props,
  };
};
/**
 * Generates a user instance from the properties provided.
 * @param  {Object} props Properties to use for the user.
 * @return {Object}       A user instance
 */
module.exports = async (props = {}) => User.create(await data(props));
