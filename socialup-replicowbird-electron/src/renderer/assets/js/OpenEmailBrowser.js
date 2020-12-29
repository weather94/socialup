import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadCookie(driver, email) {
  try {
    if (email.cookie) {
      const _cookies = JSON.parse(email.cookie);
      if (email.site === '구글') {
        for (let site of Object.keys(_cookies)) {
          await driver.get(site);
          if (_cookies[site].cookie) {
            for (const cookie of _cookies[site].cookie) {
              await driver.manage().addCookie(cookie);
            }
          }
          if (_cookies[site].sessionStorage) {
            for (const item of _cookies[site].sessionStorage) {
              await driver.executeScript(`sessionStorage['${item.key}'] = '${item.value}';`);
            }
          }
          if (_cookies[site].localStorage) {
            for (const item of _cookies[site].localStorage) {
              await driver.executeScript(`localStorage['${item.key}'] = '${item.value}';`);
            }
          }
        }
      } else {
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
    }
  } catch (e) { console.log(e); }
}

async function saveCookie(email, store, driver) {
  if (email.site === '구글') {
    const address = ['https://clients5.google.com', 'https://www.google.com/'];
    let cookies = {};
    for (let addr of address) {
      await driver.get(addr);
      const cookie = {
        cookie: await driver.manage().getCookies(),
        sessionStorage: await driver.executeScript('return Object.keys(sessionStorage).map(item => ({ key: item, value: sessionStorage[item]}));'),
        localStorage: await driver.executeScript('return Object.keys(localStorage).map(item => ({ key: item, value: localStorage[item]}));'),
      }
      console.log(cookies);
      cookies[addr] = cookie;
    }
    console.log(cookies);
    store.dispatch('updateEmail', {
      id: email.id,
      cookie: JSON.stringify(cookies),
    });
  } else {
    const cookie = JSON.stringify({
      cookie: await driver.manage().getCookies(),
      sessionStorage: await driver.executeScript('return Object.keys(sessionStorage).map(item => ({ key: item, value: sessionStorage[item]}));'),
      localStorage: await driver.executeScript('return Object.keys(localStorage).map(item => ({ key: item, value: localStorage[item]}));'),
    });
    store.dispatch('updateEmail', {
      id: email.id,
      cookie,
    });
  }
}

function run(email, store, closeEmailBrowser, proxy) {
  let driver = null;
  setTimeout(async () => {
    try {
      let chromeCapabilities = Capabilities.chrome();
      const args = [
        '--disable-infobars',
      ];

      if (proxy) {
        args.push(`--proxy-server=http://${proxy}`);
      }
      chromeCapabilities.set('chromeOptions', { args });

      driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
      if (email.site === '네이버') {
        await driver.get('https://www.naver.com/');
      } else if (email.site === '다음') {
        await driver.get('https://www.daum.net');
      } else if (email.site === '네이트') {
        await driver.get('https://www.nate.com/');
      } else if (email.site === '구글') {
        await driver.get('https://www.google.co.kr/');
      } else if (email.site === '얀덱스') {
        await driver.get('https://yandex.com/');
      } else if (email.site === '야후') {
        await driver.get('https://www.yahoo.com/');
      } else if (email.site === '투타노타') {
        await driver.get('https://tutanota.com/');
      }
      if (email.cookie) {
        await loadCookie(driver, email);
        await driver.navigate().refresh();
      }
      while(true) {
        await driver.getTitle();
        // console.log(await driver.getTitle());
        await sleep(1);
      }
    } catch(e) {
      closeEmailBrowser(email);
      console.log(e);
      return;
    }
  });

  return () => {
    if (driver) {
      saveCookie(email, store, driver);
    }
  }
}

export default run;
