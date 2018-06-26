const puppeteer = require('puppeteer');
const truncate = require('../models/truncate');
const UserFactory = require('../factories/user');
require('../../../index');

async function clearInputs(page) {
  await page.evaluate(() => document.querySelectorAll('input').forEach((n) => { n.value = ''; })); // eslint-disable-line
}
async function completeForm(page, data) {
  for (const input in data) {
    await page.type(`input[name=${input}]`, data[input]); // eslint-disable-line
  }
}

const APP = 'http://localhost:3000';
let page;
let browser;

const browserConfig = {
  headless: false,
  slowMo: 10,
};

beforeAll(async () => {
  truncate(['Project', 'User', 'Contributions']);
  browser = await puppeteer.launch(browserConfig);
  page = await browser.newPage();
});
afterAll(() => {
  browser.close();
});

describe('Home', () => {
  it('Starting with no errors', async () => {
    await page.goto(APP);
    const text = await page.content();
    expect(text).toContain('Projects');
  });
});

describe('Sign in', () => {
  beforeEach(async () => {
    await truncate(['User']);
    await UserFactory({ email: 'my@email.com', password: '1234' });
    await page.goto(`${APP}/sign-in`);
    await page.waitForSelector('input[name=email]');
    await page.waitForSelector('button[type=submit]');
    await clearInputs(page);
  });
  it('Fails with mail and password error', async () => {
    await completeForm(page, {
      email: 'no@email.com',
      password: '12345',
    });
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Email or password error');
  });
  it('Fails with mail error', async () => {
    await completeForm(page, {
      email: 'no@email.com',
      password: '1234',
    });
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Email or password error');
  });
  it('Fails with password error', async () => {
    await completeForm(page, {
      email: 'my@email.com',
      password: '12345',
    });
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Email or password error');
  });
  it('Success at good mail and password', async () => {
    await completeForm(page, {
      email: 'my@email.com',
      password: '1234',
    });
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Projects');
  });
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
  });
  it('Fails on good form and not uniq email', async () => {
    await completeForm(page, {
      name: 'user',
      email: 'no@email.com',
      password: '1234',
      passwordR: '1234',
    });
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Projects');
  });
  it('Success on good form and uniq email', async () => {
    await completeForm(page, {
      name: 'user',
      email: 'my@email.com',
      password: '1234',
      passwordR: '1234',
    });
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Projects');
  });
});

