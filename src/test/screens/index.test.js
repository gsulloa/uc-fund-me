const puppeteer = require('puppeteer');
const truncate = require('../models/truncate');
const UserFactory = require('../factories/user');
const ProjectFactory = require('../factories/project');
const ContributionFactory = require('../factories/contribution');
require('../../../index');

function waitFor(timeToWait) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeToWait);
  });
}
const waitingTime = 1500;

async function clearInputs(page) {
  await page.evaluate(() => document.querySelectorAll('input').forEach((n) => { n.value = ''; })); // eslint-disable-line
}
async function completeForm(page, data) {
  await waitFor(waitingTime);
  for (const input in data) {
    await page.type(`input[name=${input}]`, data[input]); // eslint-disable-line
  }
}
async function clickSubmit(page, selector) {
  await page.click(selector || 'button[type=submit]');
  await waitFor(waitingTime);
}
const APP = 'http://localhost:3000';
async function goTo(page, path, options = { waitUntil: 'networkidle2' }) {
  await page.goto(path ? `${APP}${path}` : APP, options);
  if (!Object.keys(options).length) await waitFor(waitingTime);
}


const timeout = 30000;
let page;
let browser;

const browserConfig = true ? {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
} : {
  headless: false,
  slowMo: 10,
};


beforeAll(async () => {
  await truncate();
  browser = await puppeteer.launch(browserConfig);
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
}, timeout);
afterAll(async () => {
  await truncate();
  browser.close();
}, timeout);

describe('Home', () => {
  it('Starting with no errors', async () => {
    await goTo(page);
    const text = await page.content();
    expect(text).toContain('Projects');
  }, timeout);
});

describe('session', () => {
  describe('Sign in', () => {
    beforeEach(async () => {
      await truncate(['User']);
      await UserFactory({ email: 'my@email.com', password: '1234' });
      await goTo(page, '/sign-in');
      await page.waitForSelector('input[name=email]');
      await page.waitForSelector('button[type=submit]');
      await clearInputs(page);
    }, timeout);
    it('Fails with mail and password error', async () => {
      await completeForm(page, {
        email: 'no@email.com',
        password: '12345',
      });
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('Email or password error');
    }, timeout);
    it('Fails with mail error', async () => {
      await completeForm(page, {
        email: 'no@email.com',
        password: '1234',
      });
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('Email or password error');
    }, timeout);
    it('Fails with password error', async () => {
      await completeForm(page, {
        email: 'my@email.com',
        password: '12345',
      });
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('Email or password error');
    }, timeout);
    it('Success at good mail and password', async () => {
      await completeForm(page, {
        email: 'my@email.com',
        password: '1234',
      });
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('Projects');
      expect(content).toContain('Logout');
      await clickSubmit(page);
    }, timeout);
  });

  describe('Sign up', () => {
    beforeEach(async () => {
      await truncate(['User']);
      await UserFactory({ email: 'my@email.com', password: '1234' });
      await goTo(page, '/sign-up');
      await page.waitForSelector('input[name=email]');
      await page.waitForSelector('input[name=name]');
      await page.waitForSelector('input[name=password]');
      await page.waitForSelector('input[name=passwordR]');
      await page.waitForSelector('button[type=submit]');
      await clearInputs(page);
    }, timeout);
    it('Fails on bad password not match', async () => {
      await completeForm(page, {
        name: 'user',
        email: 'my@email.com',
        password: '1234',
        passwordR: '12345',
      });
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('do not match');
    }, timeout);
    it('Fails on good form and not uniq email', async () => {
      await completeForm(page, {
        name: 'user',
        email: 'my@email.com',
        password: '1234',
        passwordR: '1234',
      });
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('email must be uniq');
    }, timeout);
    it('Success on good form and uniq email', async () => {
      await waitFor(waitingTime);
      await completeForm(page, {
        name: 'user',
        email: 'new@email.com',
        password: '1234',
        passwordR: '1234',
      });
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('Projects');
      expect(content).toContain('Logout');
      await clickSubmit(page);
    }, timeout);
  });

  describe('signed in', () => {
    beforeEach(async () => {
      await truncate(['User']);
      const credentials = { email: 'my@email.com', password: '1234' };
      await UserFactory(credentials);
      await goTo(page, '/sign-in');
      await page.waitForSelector('input[name=email]');
      await page.waitForSelector('button[type=submit]');
      await completeForm(page, credentials);
      await clickSubmit(page);
    }, timeout);
    afterAll(async () => {
      await clickSubmit(page);
    });
    it('Sign out success', async () => {
      await clickSubmit(page);
      const content = await page.content();
      expect(content).toContain('Sign in');
    }, timeout);
    describe('Redirect on auth paths', async () => {
      it('redirect on sign in', async () => {
        await goTo(page, '/sign-in', {});
        const content = await page.content();
        expect(content).toContain('Projects', {});
      }, timeout);
      // it('redirect on sign up', async () => {
      //   goTo(page, '/sign-up', {});
      //   const content = await page.content();
      //   expect(content).toContain('Projects');
      // }, timeout);
    });
  });
});

describe('project', async () => {
  let projects;
  beforeAll(async () => {
    const owner = await UserFactory({ email: 'routes.projects@owner.com' });
    const titles = ['project1', 'new project 1', 'another project'];
    projects = await Promise.all(titles.map(title => ProjectFactory({ UserId: owner.id, title })));
    const contributor = await UserFactory({ email: 'routes.projects@contributor.com' });
    const [{ goal, id }] = projects;
    await ContributionFactory({
      amount: Math.round(goal / 2),
      ProjectId: id,
      UserId:
      contributor.id,
    });
    await goTo(page);
  });
  it('projects loaded', async () => {
    const content = await page.content();
    projects.forEach(p => expect(content).toContain(p.title));
  });
  describe('search', () => {
    beforeEach(async () => {
      await clearInputs(page);
    });
    it('project exist', async () => {
      await completeForm(page, {
        q: 'another project',
      });
      await page.$eval('#search-form', form => form.submit());
      await waitFor(waitingTime);
      await clearInputs(page);
      const content = await page.content();
      expect(content).toContain('another project');
      ['project1', 'new project 1'].forEach(p => expect(content).not.toContain(p.title));
    });
    it('project doesnt exist', async () => {
      await completeForm(page, {
        q: 'this project doesnt exist',
      });
      await page.$eval('#search-form', form => form.submit());
      await waitFor(waitingTime);
      await clearInputs(page);
      const content = await page.content();
      projects.forEach(p => expect(content).not.toContain(p.title));
    });
  });
  describe('project show', () => {
    let project;
    beforeAll(async () => {
      [project] = projects;
      await goTo(page, `/projects/${project.slug}`);
    });
    it('show propperly project', async () => {
      const content = await page.content();
      expect(content).toContain(project.title);
      expect(content).toContain(project.description);
      expect(content).toContain(project.goal);
    });
  });
  it('show not found project', async () => {
    await goTo(page, '/projects/slug-not-found');
    const content = await page.content();
    expect(content).toContain('Not Found');
  });
});

