import { Builder, By, until, Capabilities } from 'selenium-webdriver';
import WorkLog from './WorkLog';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

async function saveCookie(driver, store, id, username) {
  let date = new Date().getTime() + 30*24*3600*1000;
  let date2 = new Date().getTime() + 30*24*(3600+10)*1000;
  await driver.executeScript(`localStorage['ig_a2hs_dismiss'] = '${date}';`);
  await driver.executeScript(`localStorage['ig_notifications_dismiss'] = '${date2}';`);
  const account = {
    id,
    username,
    cookie: {
      cookie: await driver.manage().getCookies(),
      sessionStorage: await driver.executeScript('return Object.keys(sessionStorage).map(item => ({ key: item, value: sessionStorage[item]}));'),
      localStorage: await driver.executeScript('return Object.keys(localStorage).map(item => ({ key: item, value: localStorage[item]}));'),
    },
  }
  console.log(account.cookie);
  console.log(JSON.stringify(account.cookie.cookie));
  store.dispatch('setAccount', account);
  store.dispatch('createProcess', id);
}

async function loadCookie(driver, store, id) {
  if (store.state.instagram.account[id] && store.state.instagram.account[id].cookie) {
    const cookies = store.state.instagram.account[id].cookie;
    for (const cookie of cookies) {
      await driver.manage().addCookie(cookie);
    }
  }
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
}

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run(store, instagramId) {
  let driver;
  try {
    store.dispatch('addWorkLog', new WorkLog(3, 'success', '', 'c_i_ip', 'start'));
    const chromeCapabilities = Capabilities.chrome();
    const mobileEmulation = {
      deviceMetrics: {
        width: 360,
        height: 640,
        pixelRatio: 3.0,
      },
      userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
    };
    const args = ['--disable-infobars', '--lang=ko_KR', '--window-size=400,640'];
    chromeCapabilities.set('chromeOptions', { args, mobileEmulation });
    // const chromeCapabilities = Capabilities.chrome();
    // chromeCapabilities.set('chromeOptions', {
    //   'args': [
    //     // '--headless',
    //     `--user-agent=${USER_AGENT}`,
    //     '--disable-gpu',
    //     '--disable-infobars',
    //     '--window-size=400,640',
    //   ]
    // });
    driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
    // await loadCookie(driver, store, instagramId);

    while(true) {
      const currentUrl = await driver.getCurrentUrl();
      if ("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
        try {
          await driver.wait(until.elementLocated(By.xpath('//a[span[img[contains(@alt, "프로필")]]]')), 10000);
          let username = await driver.findElement(By.xpath('//a[span[img[contains(@alt, "프로필")]]]')).getAttribute("href");
          username = username.replace('https://www.instagram.com/', '').replace('/', '');
          await saveCookie(driver, store, instagramId, username);
          await driver.quit();
          store.dispatch('addWorkLog', new WorkLog(4, 'success', '', 'c_i_ip', `detected login id: ${instagramId} / username: ${username}`));
          return {
            instagramId,
            username,
          };
        } catch(e) {
          console.log(e);
          store.dispatch('addWorkLog', new WorkLog(4, 'error', '', 'c_i_ip_e1', e));
        }
      } else if ("https://www.instagram.com/?hl=ko#reactivated" === currentUrl) {
        await driver.get("https://www.instagram.com/?hl=ko");
      } else {
        store.dispatch('addWorkLog', new WorkLog(4, 'success', '', 'c_i_ip', 'login detect...'));
        await sleep(1);
      }
    }
  } catch(e) {
    store.dispatch('addWorkLog', new WorkLog(5, 'error', '', 'c_i_ip_e2', e));
    if (!driver) {
      await driver.quit();
    }
    return null;
  }
}

export default run;
