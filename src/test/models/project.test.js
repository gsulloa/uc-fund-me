const { ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');
const truncate = require('./truncate');
const userFactory = require('../factories/user');
const projectFactory = require('../factories/project');
const { Project, User } = require('../../models');

describe('Project model', () => {
  let user;
  describe('creation', () => {
    let project;
    beforeEach(async () => {
      await truncate(['Project', 'User']);
      user = await userFactory();
      project = await projectFactory({ UserId: user.id });
    });

    it('project is created', async () => {
      expect(project).toBeInstanceOf(Project);
    });
    it('project is found', async () => {
      const projectFound = await Project.findOne({ where: { id: project.id }, includes: [User] });
      expect(projectFound).toBeInstanceOf(Project);
      expect(projectFound.dataValues).toMatchObject(project.dataValues);
      expect(projectFound.getUser()).resolves.toBeInstanceOf(User);
    });
  });
  describe('wrong fields', () => {
    beforeEach(async () => {
      await truncate(['Project', 'User']);
      user = await userFactory();
    });

    it('title is undefined', () => expect(projectFactory({ title: undefined, UserId: user.id })).rejects.toThrow(TypeError));
    it('title is blank', () => expect(projectFactory({ title: '', UserId: user.id })).rejects.toThrow(ValidationError));
    it('goal is undefined', () => expect(projectFactory({ goal: undefined, UserId: user.id })).rejects.toThrow(ValidationError));
    it('goal is not a number', () => expect(projectFactory({ goal: 'goal', UserId: user.id })).rejects.toThrow(ValidationError));
    it('goal is zero', () => expect(projectFactory({ goal: 0, UserId: user.id })).rejects.toThrow(ValidationError));
  });
  describe('wrong associations', () => {
    beforeEach(async () => {
      await truncate(['Project']);
    });
    it('project has no user', () => expect(projectFactory()).rejects.toThrow(ValidationError));
  });
  describe('hooks', () => {
    beforeEach(async () => {
      await truncate();
    });
  });
});
