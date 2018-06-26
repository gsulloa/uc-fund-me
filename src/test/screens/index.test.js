const puppeteer = require('puppeteer');
const truncate = require('../models/truncate');
const UserFactory = require('../factories/user');
require('../../../index');

async function clearInputs(page) {
  await page.evaluate(() => document.querySelectorAll('input').forEach((n) => { n.value = ''; })); // eslint-disable-line
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
    await page.type('input[name=email]', 'no@email.com');
    await page.type('input[name=password]', '12345');
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Email or password error');
  });
  it('Fails with mail error', async () => {
    await page.type('input[name=email]', 'no@email.com');
    await page.type('input[name=password]', '1234');
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Email or password error');
  });
  it('Fails with password error', async () => {
    await page.type('input[name=email]', 'my@email.com');
    await page.type('input[name=password]', '123');
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Email or password error');
  });
  it('Success at good mail and password', async () => {
    await page.type('input[name=email]', 'my@email.com');
    await page.type('input[name=password]', '1234');
    await page.click('button[type=submit]');
    const content = await page.content();
    expect(content).toContain('Projects');
  });
});
