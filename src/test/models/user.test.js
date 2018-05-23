const truncate = require('./truncate');
const userFactory = require('../factories/user');
const { User } = require('../../models');
const { ValidationError } = require('sequelize');
/* eslint-disable */

describe('User model', () => {
  describe('creation', () => {
    let user;
    beforeEach(async () => {
      await truncate();
      user = await userFactory();
    });
  
    it('user is created', async () => {
      expect(user).toBeInstanceOf(User);
    });
    it('user is found', async () => {
      const userFound = await User.findOne({ where : { email: user.email } });
      expect(userFound).toBeInstanceOf(User);
      expect(userFound.dataValues).toMatchObject(user.dataValues);
    })
    it('user is not admin', async () => {
      expect(user.isAdmin).toBeFalsy();
    })
  })
  describe('wrong fields', () => {
    it('email is not email', () => {
      return expect(userFactory({ email: 'a' })).rejects.toThrowError(ValidationError);
    })
    it('email is not defined', () => {
      return expect(userFactory({ email: undefined })).rejects.toThrowError(ValidationError);
    })
    it('email is not unique', async () => {
      await userFactory({ email: 'email@email.com' });
      return expect(userFactory({ email: 'email@email.com' })).rejects.toThrowError(ValidationError);
    })
    it('password is not defined', () => {
      return expect(userFactory({ password: undefined })).rejects.toThrowError(ValidationError);
    })
    it('password is to short', () => {
      return expect(userFactory({ password: "1" })).rejects.toThrowError(ValidationError);
    })
    it('password is empty', () => {
      return expect(userFactory({ password: "" })).rejects.toThrowError(ValidationError);
    })
    it('name is not defined', () => {
      return expect(userFactory({ name: undefined })).rejects.toThrowError(ValidationError);
    })
    it('name is empty', () => {
      return expect(userFactory({ name: "" })).rejects.toThrowError(ValidationError);
    })
  })
});

/* eslint-enable */
