const puppeteer = require('puppeteer');

const APP = 'https://www.google.cl';

let page;
let browser;
const width = 1920;
const height = 1080;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});
afterAll(() => {
  browser.close();
});

describe('testing puppeteer', () => {
  it('subimit', async () => {
    await page.goto(APP);
    await page.waitForSelector('input[name=q]');
    await page.click('input[name=q]');
    await page.type('puppeteer');
    await page.waitForSelector('input[name=btnI]');
    await page.click('input[name=btnI]');
  }, 16000);
});
