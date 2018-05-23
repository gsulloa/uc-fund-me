const { ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');
const truncate = require('./truncate');
const userFactory = require('../factories/user');
const projectFactory = require('../factories/project');
const { Project, User } = require('../../models');
/* eslint-disable */

describe('Project model', () => {
  describe('creation', () => {
    let project, user;
    beforeEach(async () => {
      await truncate();
      user = await userFactory()
      project = await projectFactory({ UserId: user.id });
    });
  
    it('project is created', async () => {
      expect(project).toBeInstanceOf(Project);
    });
    it('project is found', async () => {
      const projectFound = await Project.findOne({ where : { id: project.id }, includes: [User] });
      expect(projectFound).toBeInstanceOf(Project);
      expect(projectFound.dataValues).toMatchObject(project.dataValues);
      expect(projectFound.getUser()).resolves.toBeInstanceOf(User);
    })
  })
  describe('wrong fields', () => {
    beforeEach(async () => {
      await truncate();
      user = await userFactory()
    })

    it('title is undefined', () => {
      return expect(projectFactory({ title: undefined, UserId: user.id })).rejects.toThrow(ValidationError);
    })
    it('title is blank', () => {
      return expect(projectFactory({ title: "", UserId: user.id })).rejects.toThrow(ValidationError);
    })

  })
  describe('wrong associations', () => {
    beforeEach(async () => {
      await truncate();
    })
    it('project has no user', () => {
      return expect(projectFactory()).rejects.toThrow(ValidationError);
    })
  })
  describe('hooks', () => {
    beforeEach(async () => {
      await truncate();
    });
  })
});

/* eslint-enable */