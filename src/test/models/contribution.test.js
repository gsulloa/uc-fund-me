const { ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');
const truncate = require('./truncate');
const userFactory = require('../factories/user');
const projectFactory = require('../factories/project');
const contributionFactory = require('../factories/contribution');
const { Contribution, User, Project } = require('../../models');

describe('Contribution model', () => {
  let contribution;
  let project;
  let user;
  let owner;
  describe('creation', () => {
    beforeEach(async () => {
      await truncate(['Contribution', 'User', 'Project']);
      user = await userFactory();
      owner = await userFactory();
      project = await projectFactory({ UserId: owner.id });
      contribution = await contributionFactory({ UserId: user.id, ProjectId: project.id });
    });

    it('contribution is created', async () => {
      expect(contribution).toBeInstanceOf(Contribution);
    });
    it('contribution is found', async () => {
      // eslint-disable-next-line
      const contributionFound = await Contribution.findOne({ where: { id: contribution.id }, includes: [User, Project] });
      expect(contributionFound).toBeInstanceOf(Contribution);
      expect(contributionFound.dataValues).toMatchObject(contribution.dataValues);
      expect(contributionFound.getUser()).resolves.toBeInstanceOf(User);
      expect(contributionFound.getProject()).resolves.toBeInstanceOf(Project);
    });
  });
  describe('wrong fields', () => {
    let associations;
    beforeEach(async () => {
      await truncate(['Contribution', 'User', 'Project']);
      user = await userFactory();
      owner = await userFactory();
      project = await projectFactory({ UserId: owner.id });
      associations = {
        UserId: user.id,
        ProjectId: project.id,
      };
    });
    it('amount is undefined', () => expect(contributionFactory({ ...associations, amount: undefined })).rejects.toThrow(ValidationError));
    it('amount is 0', () => expect(contributionFactory({ ...associations, amount: 0 })).rejects.toThrow(ValidationError));
  });
  describe('wrong associations', () => {
    beforeEach(async () => {
      await truncate(['Contribution']);
    });
    it('contribution has no user', () => expect(contributionFactory()).rejects.toThrow(ValidationError));
    it('contribution has no project', () => expect(contributionFactory()).rejects.toThrow(ValidationError));
  });
  describe('hooks', () => {
    beforeEach(async () => {
      await truncate();
    });
  });
});

afterAll(async () => {
  await truncate(['Project', 'User', 'Contribution']);
});

