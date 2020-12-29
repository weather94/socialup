import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadCookie(driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
}

async function run(account) {
  let chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', {
    'args': [
      `--user-agent=${USER_AGENT}`,
      '--disable-gpu',
      '--disable-infobars',
      '--window-size=400,640',
    ]
  });
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://www.instagram.com/?hl=ko');
  await loadCookie(driver, JSON.parse(account.cookie));
  await driver.get('https://www.instagram.com/?hl=ko');
}

export default run;
