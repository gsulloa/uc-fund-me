const puppeteer = require('puppeteer');
const truncate = require('../models/truncate');
const UserFactory = require('../factories/user');
require('../../../index');

function waitFor(timeToWait) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeToWait);
  });
}
const waitingTime = 1000;

async function clearInputs(page) {
  await page.evaluate(() => document.querySelectorAll('input').forEach((n) => { n.value = ''; })); // eslint-disable-line
}
async function completeForm(page, data) {
  await waitFor(waitingTime);
  for (const input in data) {
    await page.type(`input[name=${input}]`, data[input]); // eslint-disable-line
  }
}
async function clickSubmit(page) {
  await page.click('button[type=submit]');
  await waitFor(waitingTime);
}


const APP = 'http://localhost:3000';
const timeout = 30000;
let page;
let browser;

const browserConfig = true ? {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
} : {
  headless: false,
  slowMo: 10,
};


beforeAll(async () => {
  await truncate(['Project', 'User', 'Contributions']);
  browser = await puppeteer.launch(browserConfig);
  page = await browser.newPage();
}, timeout);
afterAll(() => {
  browser.close();
}, timeout);

describe('Home', () => {
  it('Starting with no errors', async () => {
    await page.goto(APP);
    const text = await page.content();
    expect(text).toContain('Projects');
  }, timeout);
});

describe('Sign in', () => {
  beforeEach(async () => {
    await truncate(['User']);
    await UserFactory({ email: 'my@email.com', password: '1234' });
    await page.goto(`${APP}/sign-in`);
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
  }, timeout);
});

describe('Sign up', () => {
  beforeEach(async () => {
    await truncate(['User']);
    await UserFactory({ email: 'my@email.com', password: '1234' });
    await page.goto(`${APP}/sign-up`);
    await page.waitForSelector('input[name=email]');
    await page.waitForSelector('input[name=name]');
    await page.waitForSelector('input[name=password]');
    await page.waitForSelector('input[name=passwordR]');
    await page.waitForSelector('button[type=submit]');
    await clearInputs(page);
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
  }, timeout);
});

