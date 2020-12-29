import { Builder, By, until, Capabilities } from 'selenium-webdriver';
import LogDetail from './LogDetail';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

function msleep(sec) {
  let ms = sec + Math.random()*100;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadCookie(driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
}

async function run(store, urls) {
  let driver;
  let cookie;
  let first = true;
  try {
    const chromeCapabilities = Capabilities.chrome();
    const mobileEmulation = {
      deviceMetrics: {
        width: 360,
        height: 640,
        pixelRatio: 3.0,
      },
      userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
    };
    chromeCapabilities.set('chromeOptions', { 'args': [
      '--disable-gpu',
      '--disable-infobars',
      '--window-size=600,800',
    ], mobileEmulation });
    driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    await driver.get('https://www.instagram.com/');
    if (store.state.account.cookie) await loadCookie(driver, store.state.account.cookie);
    await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
    while(true) {
      const currentUrl = await driver.getCurrentUrl();
      try {
        if ("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
          await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
          let username = await driver.findElement(By.xpath('//a[span[@aria-label="프로필"]]')).getAttribute("href");
          username = username.replace('https://www.instagram.com/', '').replace('/', '');
          cookie = await driver.manage().getCookies();
          store.dispatch('setCookie', cookie);
          break;
        } else if ("https://www.instagram.com/?hl=ko#reactivated" === currentUrl) {
          await driver.get("https://www.instagram.com/?hl=ko");
        } else if ("https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher" === currentUrl && first) {
          await driver.findElement(By.xpath('//input[@name="username"]')).sendKeys(store.state.account.loginId);
          await sleep(2);
          await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys(store.state.account.loginPw);
          await sleep(2);
          await driver.findElement(By.xpath('//button[@type="submit"]')).click();
          first = false;
        } else if ("https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher" === currentUrl && first === false) {
        }
      } catch (e) {
        console.log(e);
        await sleep(20);
      }
      await sleep(1);
    }

    for (let url of urls) {
      await driver.get(`${url}`);
      await driver.findElement(By.xpath('//a[contains(text(), "좋아요")]')).click();
      while (true) {
        try {
          const result = await driver.executeScript(`return (document.documentElement.scrollHeight - document.documentElement.scrollTop)`);
          console.log(result);
          if (result <= 640) {
            await driver.wait(until.elementLocated(By.css('svg')), 5000);
          }
          await driver.executeScript(`window.scrollTo(0, document.body.scrollHeight);`);
        } catch (e) {
          console.log(e);
          break;
        }
        await msleep(200);
      }
      const data = await driver.executeScript(`return [...document.querySelectorAll('a div div div')].map(item => item.innerText)`);
      console.log(data);
      return;
    }
  } catch(e) {
    console.log(e);
  }
  try { await driver.quit(); } catch(e) { }
  return cookie;
}

export default run;
