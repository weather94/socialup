import { Builder, By, until, Capabilities } from 'selenium-webdriver';
import LogDetail from './LogDetail';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logMessage(http, work, option, text) {
  if (text !== work.beforeText) {
    const currentDate = new Date(); 
    work.logs.push(new LogDetail(20, false, option.email, currentDate.toLocaleDateString(), null, currentDate.toLocaleTimeString(), null, text));
    work.beforeText = text;
    saveLogDetail(http, work);
  }
}

async function loadCookie(driver, cookies) {
  try {
    if (cookies) {
      const _cookies = JSON.parse(cookies);
      console.log(_cookies);
      if (_cookies.cookie) {
        for (const cookie of _cookies.cookie) {
          await driver.manage().addCookie(cookie);
        }
      }
      if (_cookies.sessionStorage) {
        for (const item of _cookies.sessionStorage) {
          await driver.executeScript(`sessionStorage['${item.key}'] = '${item.value}';`);
        }
      }
      if (_cookies.localStorage) {
        for (const item of _cookies.localStorage) {
          await driver.executeScript(`localStorage['${item.key}'] = '${item.value}';`);
        }
      }
    }
  } catch (e) { console.log(e); }
}

function saveLogDetail(http, work) {
  if (work.logs.length > 0) {
    http.post('api/instagram/proxy/log-details', work.logs);
    work.logs = [];
  }
};

async function run(http, work, option, _driver) {
  let driver;
  let browserState;
  let first = true;
  try {
    if (_driver) {
      driver = _driver;
    } else {
      const chromeCapabilities = Capabilities.chrome();
      const mobileEmulation = {
        deviceMetrics: {
          width: 360,
          height: 640,
          pixelRatio: 3.0,
        },
        userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
      };
      const args = [
        '--disable-gpu',
        '--disable-infobars',
        '--window-size=400,640',
        `--proxy-server=http://${option.proxyServer}`,
      ];
      chromeCapabilities.set('chromeOptions', { args, mobileEmulation});
      driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    }
    await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
    await loadCookie(driver, option.cookie);
    await driver.manage().deleteCookie('sessionid');
    while(true) {
      const currentUrl = await driver.getCurrentUrl();
      try {
        if ("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
          await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
          let username = await driver.findElement(By.xpath('//a[span[@aria-label="프로필"]]')).getAttribute("href");
          username = username.replace('https://www.instagram.com/', '').replace('/', '');
          const cookie = await driver.manage().getCookies();
          const sessionStorage = await driver.executeScript('return Object.keys(sessionStorage).map(item => ({ key: item, value: sessionStorage[item]}));');
          const localStorage = await driver.executeScript('return Object.keys(localStorage).map(item => ({ key: item, value: localStorage[item]}));');
          browserState = JSON.stringify({
            cookie,
            sessionStorage,
            localStorage,
          });
          logMessage(http, work, option, '로그인에 성공하셨습니다.');
          break;
        } else if ("https://www.instagram.com/?hl=ko#reactivated" === currentUrl) {
          await driver.get("https://www.instagram.com/?hl=ko");
        } else if ("https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher" === currentUrl && first) {
          await driver.findElement(By.xpath('//input[@name="username"]')).sendKeys(option.email);
          await sleep(2);
          await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys(option.password);
          await sleep(2);
          await driver.findElement(By.xpath('//button[@type="submit"]')).click();
          await sleep(5);
          first = false;
        } else if ("https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher" === currentUrl && first === false) {
          logMessage(http, work, option, '로그인에 실패하셨습니다.');
        }
      } catch (e) {
        console.log(e);
        await sleep(20);
      }
      await sleep(1);
    }
  } catch(e) {
    console.log(e);
  }
  if (!_driver) { 
    try { await driver.quit(); } catch(e) { }
  }
  return browserState;
}

export default run;
