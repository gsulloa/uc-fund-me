const { ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');
const truncate = require('./truncate');
const userFactory = require('../factories/user');
const { User } = require('../../models');

describe('User model', () => {
  describe('creation', () => {
    let user;
    beforeEach(async () => {
      await truncate(['User']);
      user = await userFactory({ email: 'user.creation@user.com' });
    });

    it('user is created', async () => {
      expect(user).toBeInstanceOf(User);
    });
    it('user is found', async () => {
      const userFound = await User.findOne({ where: { email: user.email } });
      expect(userFound).toBeInstanceOf(User);
      expect(userFound.dataValues).toMatchObject(user.dataValues);
    });
    it('user is not admin', async () => {
      expect(user.isAdmin).toBeFalsy();
    });
  });
  describe('wrong fields', () => {
    it('email is not email', () => expect(userFactory({ email: 'a' })).rejects.toThrowError(ValidationError));
    it('email is not defined', () => expect(userFactory({ email: undefined })).rejects.toThrowError(ValidationError));
    it('email is not unique', async () => expect(User.bulkCreate([
      { email: 'email@email.com', name: 'user1', password: '123456' },
      { email: 'email@email.com', name: 'user2', password: '123456' },
    ])).rejects.toThrowError(ValidationError));
    it('password is not defined', () => expect(userFactory({ password: undefined })).rejects.toThrowError(ValidationError));
    it('password is to short', () => expect(userFactory({ password: '1' })).rejects.toThrowError(ValidationError));
    it('password is empty', () => expect(userFactory({ password: '' })).rejects.toThrowError(ValidationError));
    it('name is not defined', () => expect(userFactory({ name: undefined })).rejects.toThrowError(ValidationError));
    it('name is empty', () => expect(userFactory({ name: '' })).rejects.toThrowError(ValidationError));
  });
  describe('hooks', () => {
    beforeEach(async () => {
      await truncate(['User']);
    });
    it('build password', async () => {
      const user = await userFactory({ email: 'user.hooks.buildpassword@user.com', password: 'password' });
      expect(bcrypt.compare('password', user.password)).toBeTruthy();
    });
  });
  describe('prototype funcs', () => {
    beforeEach(async () => {
      await truncate(['User']);
    });
    it('compare password', async () => {
      const user = await userFactory({ email: 'user.hooks.comparepassword@user.com', password: 'password' });
      expect(user.checkPassword('password')).toBeTruthy();
    });
  });
});

afterAll(async () => {
  await truncate(['User']);
});

