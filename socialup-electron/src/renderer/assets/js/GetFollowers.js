/* eslint-disable */
import { Builder, By, until, Capabilities } from 'selenium-webdriver';
import FollowLog from './FollowLog';
import WorkLog from './WorkLog';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec));
}

async function loadCookie(store, driver, id) {
  if (store.state.instagram.account[id] && store.state.instagram.account[id].cookie) {
    const cookies = store.state.instagram.account[id].cookie;
    for (const cookie of cookies) {
      await driver.manage().addCookie(cookie);
    }
  }
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
}

async function checkLogin(store, driver) {
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
  const currentUrl = await driver.getCurrentUrl();
  if("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
    return true;
  } else {
    await store.dispatch('addWorkLog', new WorkLog(2, 'error', 'gfollowers', 'check_login'));
    // await takeScreenshot(driver, 'loginFail');
    return false;
  }
}

async function run(store, setFriends) {
  await store.dispatch('addWorkLog', new WorkLog(81, 'success', 'gfollowers', 'start'));
  let result;
  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', {
    args: [
      `--user-agent=${USER_AGENT}`,
      '--headless',
      '--lang=ko_KR',
      '--disable-infobars',
    ],
  });
  const driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get(`https://www.instagram.com/?hl=ko`);
  await loadCookie(store, driver, store.state.instagram.loginId);
  result = await checkLogin(store, driver);
  if (result === false) {
    alertAndClose(store, driver, '인스타그램 로그인에 실패하였습니다.\n왼쪽메뉴 마이페이지에서 인스타그램 계정을 등록해주세요.');
    return;
  }

  await driver.get('https://www.instagram.com/accounts/access_tool/accounts_following_you?hl=ko');
  try {
    store.dispatch('plusFollowersCount');
    while(true) {
      await driver.wait(until.elementLocated(By.xpath('//button[text()="더 보기"][not(@disabled)]')), 10000);
      await driver.findElement(By.xpath('//button[text()="더 보기"][not(@disabled)]')).click();
      store.dispatch('plusFollowersCount');
      await sleep(200);
    }
  } catch(e) {
    await store.dispatch('addWorkLog', new WorkLog(81, 'error', 'gfollowers', e));
  }
  const followers = await driver.executeScript('return [...document.querySelectorAll("section > div")].map(item => item.innerText);');
  store.dispatch('setFollowers', followers);
  setFriends();
  driver.quit();
  return;
}

export default run;
