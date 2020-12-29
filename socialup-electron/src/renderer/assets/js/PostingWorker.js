/* eslint-disable */
import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import FileStorage from './FileStorage';
import WorkLog from './WorkLog';
import { resetRetrieveHandlers } from 'source-map-support';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkLogin(store, driver, id) {
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
  const currentUrl = await driver.getCurrentUrl();
  if("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
    return true;
  } else {
    await store.dispatch('addWorkLog', new WorkLog(2, 'error', id, 'pw', 'check_login'));
    return false;
  }
}

async function loadCookie(store, driver, cookies, id) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'pw', 'load_cookie'));
}

async function alertAndClose(store, driver, message) {
  driver.quit();
  store.dispatch('setProcess', null);
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'pw', 'alert_close'));
  if (message) {
    alert(message, '소셜업');
  }
}

async function posting(store, reserve) {
  await store.dispatch('addWorkLog', new WorkLog(1, 'success', reserve.account, 'pw_posting', 'start'));
  const process = store.state.process[reserve.account];
  const account = store.state.instagram.account[reserve.account];
  const chromeCapabilities = Capabilities.chrome();
  const mobileEmulation = {
    deviceMetrics: {
      width: 360,
      height: 640,
      pixelRatio: 3.0,
    },
    userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
  };
  const args = ['--disable-infobars', '--lang=ko_KR', '--headless'];
  if (process && process.proxy) { args.push(`--proxy-server=http://${process.proxyAddress}`); }
  chromeCapabilities.set('chromeOptions', { args, mobileEmulation });
  
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://www.instagram.com/?hl=ko');
  await loadCookie(store, driver, account.cookie, account.id);
  if (await checkLogin(store, driver, account.id)) {
    try {
      await driver.findElement(By.xpath('//div[@role="menuitem"]')).click();
      await sleep(1);
      await driver.findElement(By.xpath('//*[@id=\"react-root\"]/section/nav[2]/div/div/form/input')).sendKeys(reserve.file);
      await driver.wait(until.elementLocated(By.xpath('//button[text()="다음"]')), 10000);
      await driver.findElement(By.xpath('//button[text()="다음"]')).click();
      await driver.wait(until.elementLocated(By.xpath('//textarea')), 10000);
      for (const item of reserve.text.split('\n')) {
        await driver.findElement(By.xpath('//textarea')).sendKeys(Key.TAB);
        await driver.findElement(By.xpath('//textarea')).sendKeys('\n');
        await driver.findElement(By.xpath('//textarea')).sendKeys(Key.TAB);
        await driver.findElement(By.xpath('//textarea')).sendKeys(item);
      }
      await driver.wait(until.elementLocated(By.xpath('//button[text()="공유하기"]')), 10000);
      await driver.findElement(By.xpath('//button[text()="공유하기"]')).click();
      await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
      await driver.get(`https://www.instagram.com/${store.state.instagram.username}/`);
      const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
      store.dispatch('addPostingLog', {
        username: data.username,
        type: 'reserve',
        date: new Date(),
        shortcode: data.edge_owner_to_timeline_media.edges[0].node.shortcode,
        thumbnail: data.edge_owner_to_timeline_media.edges[0].node.thumbnail_src,
        caption: (data.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0]) ? data.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0].node.text : '',
      });
      await sleep(3);
      await driver.quit();
      return false;
    } catch (e) {
      console.log(e);
      await driver.quit();
      return e;
    }
  } else {
    store.dispatch('setTitle', `${account.id} 인스타 로그인 실패 - 게시글 예약`);
    await driver.quit();
    return {
      name: 'instagram login FAIL!'
    }
  }
}

function run(store) {
  let isRepeat = true;
  setTimeout(async () => {
    await store.dispatch('addWorkLog', new WorkLog(20, 'success', '', 'pw', `start`));
    let result = false;
    let startDate = new Date();
    let reserves = [];
    await store.state.posting.postings.forEach((item) => {
      let reserveDate = new Date(item.datetime);
      // 시간지 지금보다 안지난경우만
      if (startDate.getHours() < reserveDate.getHours() || (startDate.getHours() === reserveDate.getHours() && startDate.getMinutes() < reserveDate.getMinutes())) {
        if (item.repeat === 'onetime' && startDate.toLocaleDateString() === reserveDate.toLocaleDateString()) {
          reserves.push(item);
        } else if (item.repeat === 'daily') {
          reserves.push(item);
        } else if (item.repeat === 'weekly' && startDate.getDay() === reserveDate.getDay()) {
          reserves.push(item);
        } else if (item.repeat === 'monthly' && startDate.getDate() === reserveDate.getDate()) {
          reserves.push(item);
        }
      }
    });

    while (isRepeat) {
      let date = new Date();
      if (date.toLocaleDateString() !== startDate.toLocaleDateString()) {
        await store.dispatch('addWorkLog', new WorkLog(20, 'success', '', 'pw', `change_day`));
        startDate = new Date();
        reserves = [];
        store.state.posting.postings.forEach((item) => {
          let reserveDate = new Date(item.datetime);
          if (startDate.getHours() < reserveDate.getHours() || (startDate.getHours() === reserveDate.getHours() && startDate.getMinutes() < reserveDate.getMinutes())) {
            if (item.repeat === 'onetime' && startDate.toLocaleDateString() === reserveDate.toLocaleDateString()) {
              reserves.push(item);
            } else if (item.repeat === 'daily') {
              reserves.push(item);
            } else if (item.repeat === 'weekly' && startDate.getDay() === reserveDate.getDay()) {
              reserves.push(item);
            } else if (item.repeat === 'monthly' && startDate.getDate() === reserveDate.getDate()) {
              reserves.push(item);
            }
          }
        });
      }
      for (let reserve of reserves) {
        let reserveDate = new Date(reserve.datetime);
        if (date.getHours() > reserveDate.getHours() || (date.getHours() === reserveDate.getHours() && date.getMinutes() > reserveDate.getMinutes())) {
          console.log(`${date.toTimeString()} > ${new Date(reserve.datetime).toTimeString()}`);
          result = await posting(store, reserve);
          if (result) {
            await store.dispatch('addWorkLog', new WorkLog(20, 'error', '', 'pw_posting', result));
            continue;
          }
          if (reserve.repeat === 'onetime') {
            store.dispatch('removePosting', reserve);
          }
          reserves = reserves.filter(item => item !== reserve);
          break;
        }
      }
      await sleep(10);
    }
    await store.dispatch('addWorkLog', new WorkLog(20, 'success', '', 'pw', `thread_close`));
  }, 1000);

  return () => {
    store.dispatch('addWorkLog', new WorkLog(20, 'success', '', 'pw', `click_close_button`));
    isRepeat = false;
  };
}

export default run;
