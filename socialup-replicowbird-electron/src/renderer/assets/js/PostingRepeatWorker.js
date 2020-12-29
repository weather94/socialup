/* eslint-disable */
import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import FileStorage from './FileStorage';
import WorkLog from './WorkLog';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

function msleep(sec) {
  let ms = sec + Math.random()*10;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkLogin(store, driver, id) {
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
  const currentUrl = await driver.getCurrentUrl();
  if("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
    return true;
  } else {
    await store.dispatch('addWorkLog', new WorkLog(2, 'error', id, 'prw', 'check_login'));
    return false;
  }
}

async function loadCookie(store, driver, cookies, id) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'prw', 'load_cookie'));
}

async function alertAndClose(store, driver, message, id) {
  driver.quit();
  store.dispatch('setProcess', null);
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'prw', 'alert_close'));
  // if (message) {
  //   alert(message, '소셜업');
  // }
}

function randomTag(array, length) {
  length = (array.length < length) ? array.length : length;
  const extractTags = [];
  while (extractTags.length < length) {
    for (const tag of array) {
      if (extractTags.length >= length) {
        break;
      }
      if (Math.random() < (length / array.length) / 2 && !extractTags.includes(tag)) {
        extractTags.push(tag);
      }
    }
  }
  return extractTags;
}

async function posting(store, image, text) {

  await store.dispatch('addWorkLog', new WorkLog(1, 'success', store.state.instagram.loginId, 'prw', 'start'));
  const process = store.state.process[store.state.instagram.loginId];
  const account = store.state.instagram.account[store.state.instagram.loginId];
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
      await driver.findElement(By.xpath('//*[@id=\"react-root\"]/section/nav[2]/div/div/form/input')).sendKeys(image);

      await driver.wait(until.elementLocated(By.xpath('//button[text()="다음"]')), 10000);
      await driver.findElement(By.xpath('//button[text()="다음"]')).click();

      await driver.wait(until.elementLocated(By.xpath('//textarea')), 10000);
      for (const item of text.split('\n')) {
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
        type: 'repeat',
        date: new Date(),
        shortcode: data.edge_owner_to_timeline_media.edges[0].node.shortcode,
        thumbnail: data.edge_owner_to_timeline_media.edges[0].node.thumbnail_src,
        caption: (data.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0]) ? data.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0].node.text : '',
      });
      await store.dispatch('addWorkLog', new WorkLog(246, 'success', account.id, 'pw_posting', 'end'));
      await sleep(3);
      await driver.quit();
      return false;
    } catch(e) {
      await store.dispatch('addWorkLog', new WorkLog(247, 'error', account.id, 'pw_posting', e));
      await driver.quit();
      console.log(e);
      return e;
    }
  } else {
    store.dispatch('setTitle', `${account.id} 인스타 로그인 실패 - 게시글 도배`);
    await driver.quit();
    return {
      name: 'instagram login FAIL!'
    }
  }
}

function run(store) {
  let index = 0;
  let result = false;
  store.dispatch('addWorkLog', new WorkLog(20, 'success', store.state.instagram.loginId, 'prw', `setInterval`));
  const interval = setInterval(async () => {
    const image = store.state.posting.repeat.images[index % store.state.posting.repeat.images.length];
    const tags = randomTag(store.state.posting.repeat.hashtags, 15);
    const tag = `#${tags.join(' #')} \r\n`;
    let text = '';
    if (store.state.posting.repeat.text.includes('[TAG]')) {
      text = store.state.posting.repeat.text.replace('[TAG]', tag);
    } else {
      text = `${store.state.posting.repeat.text}\n.\n.\n.\n${tag}`;
    }
    result = await posting(store, image, text, store.state.instagram.loginId);
    if (result) {
      await store.dispatch('addWorkLog', new WorkLog(20, 'error', store.state.instagram.loginId, 'prw_posting', result));
    }
    index++;
  }, store.state.posting.repeat.interval*1000 + Math.random()*1000);
  return () => {
    store.dispatch('addWorkLog', new WorkLog(20, 'success', store.state.instagram.loginId, 'prw', `clearInterval`));
    clearInterval(interval);
  };
}

export default run;
