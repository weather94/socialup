/* eslint-disable */
import { Builder, By, until, Capabilities } from 'selenium-webdriver';
import FollowLog from './FollowLog';
import WorkLog from './WorkLog';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

function sleep(store, sec) {
  let ms = sec*1000 + Math.random()*1000;
  store.dispatch('addWorkLog', new WorkLog(45, 'success', 'ufw_wait', `wait ${Math.floor(ms)} mills`));
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(driver, error) {
  await driver.takeScreenshot().then(
      function(image, err) {
          require('fs').writeFile(`${error}-${new Date().getTime()}.png`, image, 'base64', function(err) {
              console.log(err);
          });
      }
  );
}

async function loadCookie(store, driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', 'ufw', 'load_cookie'));
}

async function checkLogin(store, driver) {
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
  const currentUrl = await driver.getCurrentUrl();
  if("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
    return true;
  } else {
    await store.dispatch('addWorkLog', new WorkLog(2, 'error', 'ufw', 'check_login'));
    return false;
  }
}

function run(store, friends, process, account, setting, tag) {
  let isRepeat = true;
  let driver;
  setTimeout(async () => {
    await store.dispatch('addWorkLog', new WorkLog(81, 'success', 'ufw', 'run'));

    const chromeCapabilities = Capabilities.chrome();
    const args = ['--disable-infobars', '--lang=ko_KR',  `--user-agent=${USER_AGENT}`];
    if (!process.viewBrowser) { args.push('--headless'); }
    if (process.proxy) { args.push(`--proxy-server=http://${process.proxyAddress}`); }
    chromeCapabilities.set('chromeOptions', { args, });
    driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    
    await driver.get(`https://www.instagram.com/?hl=ko`);
    await loadCookie(store, driver, account.cookie);
    if (await checkLogin(store, driver)) {
      let index = 1;
      friends = friends.reverse();
      for (const friend of friends) {
        if (!isRepeat) {
          break;
        }
        if (store.getters.getInstagramLogs && store.getters.getInstagramLogs.unfollow >= setting.followLimitPerDay) {
          await store.dispatch('addWorkLog', new WorkLog(17, 'success', 'ufw', `언팔로우 하루제한 초과 ${setting.followLimitPerDay}회`));
          alert(`언팔로우 하루제한 초과 ${setting.followLimitPerDay} 회`, '소셜업');
          break;
        } else {
          while(true) {
            try {
              await driver.get(`https://www.instagram.com/${friend.name}/?hl=ko`)
              await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로")] | //button[contains(text(), "Follow")]')), 10000);
              await driver.findElement(By.xpath('//button[text()="팔로잉"] | //button[text()="Following"]')).click();
              await sleep(store, 0);
              await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로우 취소")] | //button[contains(text(), "Unfollow")]')), 10000);
              await driver.findElement(By.xpath('//button[contains(text(), "팔로우 취소")] | //button[contains(text(), "Unfollow")]')).click();
              await sleep(store, 0);
              await driver.wait(until.elementLocated(By.xpath('//button[text()="팔로우"] | //button[text()="Follow"]')), 10000);
              await driver.navigate().refresh();
              const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
              if (data.followed_by_viewer === false) {
                await store.dispatch('addInstagramLog',  new FollowLog(4, '언팔로우', `${index}/${friends.length}`, friend.name, tag, account.id));
                await store.dispatch('addWorkLog', new WorkLog(27, 'success', 'ufw', `${tag} ${friend.name} ${index}/${friends.length}`));
                await store.dispatch('removeFriend', friend);
                index++;
                await sleep(store, 40);
                break;
              } else {
                await store.dispatch('addWorkLog', new WorkLog(456, 'error', 'ufw', `${friend.name} unfollow_omitted_refresh_check`));
                await sleep(store, 60);
              }
            } catch (e) {
              e.username = friend.name;
              if (e.name === 'NoSuchSessionError') {
                store.dispatch('setProcess', null);
                return;
              }
              await store.dispatch('addWorkLog', new WorkLog(95, 'error', 'ufw', e));
              break;
            }
          }
        }
      }
    } else {
      alertAndClose(store, driver, '인스타그램 로그인에 실패하였습니다.\n왼쪽메뉴 마이페이지에서 인스타그램 계정을 등록해주세요.');
    }
    store.dispatch('setProcess', null);
    try {
      driver.quit();
    } catch (e) { console.log(e) };
  }, 10);



  return () => {
    if (driver) {
      isRepeat = false;
      driver.quit();
      store.dispatch('addWorkLog', new WorkLog(31, 'success', 'ufw', 'ufw_click_close'));
      return true;
    }
    return false;
  };
}

export default run;
