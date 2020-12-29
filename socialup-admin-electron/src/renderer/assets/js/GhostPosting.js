/* eslint-disable */
import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import FileStorage from './FileStorage';
import { resetRetrieveHandlers } from 'source-map-support';
import request from 'request';
import appiumADB from 'appium-adb';
import publicIP from 'public-ip';
import fs from 'fs';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkLogin(driver) {
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
  const currentUrl = await driver.getCurrentUrl();
  if("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
    return true;
  } else {
    return false;
  }
}

async function getGhost(http, page, size, activeFlag) {
  const response = await http.get('api/instagram/ghost', {
    params: {
      page,
      size,
      active: activeFlag,
    },
  });
  if (response.data) {
    return response.data;
  } else {
    return null;
  }
}

async function loadCookie(driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
}

async function posting(http, account, file, tag) {
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
  chromeCapabilities.set('chromeOptions', { args, mobileEmulation });
  
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://www.instagram.com/?hl=ko');
  await loadCookie(driver, JSON.parse(account.cookie));
  if (await checkLogin(driver)) {
    try {
      await driver.findElement(By.xpath('//div[@role="menuitem"]')).click();
      await sleep(1);
      await driver.findElement(By.xpath('//*[@id=\"react-root\"]/section/nav[2]/div/div/form/input')).sendKeys(file);
      await driver.wait(until.elementLocated(By.xpath('//button[text()="다음"]')), 10000);
      await driver.findElement(By.xpath('//button[text()="다음"]')).click();
      await driver.wait(until.elementLocated(By.xpath('//textarea')), 10000);
      await driver.findElement(By.xpath('//textarea')).sendKeys(tag);
      // for (const item of reserve.text.split('\n')) {
      //   await driver.findElement(By.xpath('//textarea')).sendKeys(Key.TAB);
      //   await driver.findElement(By.xpath('//textarea')).sendKeys('\n');
      //   await driver.findElement(By.xpath('//textarea')).sendKeys(Key.TAB);
      //   await driver.findElement(By.xpath('//textarea')).sendKeys(item);
      // }
      await driver.wait(until.elementLocated(By.xpath('//button[text()="공유하기"]')), 10000);
      await driver.findElement(By.xpath('//button[text()="공유하기"]')).click();
      await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
      await driver.get(`https://www.instagram.com/${account.username}/`);
      const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
      http.get(`api/instagram/ghost/${account.id}/count`, {
        params: {
          postCount: data.edge_owner_to_timeline_media.count,
          followerCount: data.edge_followed_by.count,
          followingCount: data.edge_follow.count,
        },
      });
      console.log(`${account.id} ${account.email} ${data.edge_owner_to_timeline_media.count}`);
      await sleep(3);
      await driver.quit();
      return false;
    } catch (e) {
      console.log(e);
      await driver.quit();
      return e;
    }
  } else {
    http.get(`api/instagram/ghost/${account.id}/active`, {
      params: {
        active: false,
      },
    }).then(() => {
      account.active = false;
    });
    await driver.quit();
    return false;
  }
}

async function changeIp(adb, process) {
  if (!process.isChangeIp) {
    process.isChangeIp = true;
    await adb.broadcastAirplaneMode();
    await adb.setAirplaneMode(false);
    await adb.broadcastAirplaneMode();
    await adb.setAirplaneMode(true);
    process.ip = await publicIP.v4();
    process.isChangeIp = false;
    console.log(`아이피 변경 ${process.ip}`);
  }
}

function getRandomTags(tags, count) {
  count = (tags.length < count) ? tags.length : count;
  const returnTags = [];
  while (returnTags.length < count) {
    for (const tag of tags) {
      if (returnTags.length >= count) {
        break;
      }
      if (Math.random() < (count / tags.length) / 2 && !returnTags.includes(tag)) {
        returnTags.push(tag);
      }
    }
  }
  return returnTags;
}

function run(http, path, tags) {
  let isRepeat = true;
  
  setTimeout(async () => {
    const adb = await appiumADB.createADB();
    const process = {
      isChangeIp: false,
      ip: null,
    };
    let accounts = await getGhost(http, 0, 9999, 0);
    accounts = accounts.sort((a, b) => a.postCount - b.postCount);
    const images = await fs.readdirSync(path);
    for (let i = 0; i < images.length; i++) {
      if (!isRepeat) break;
      const filePath = `${path}\\${images[i]}`;
      const account = accounts[i % images.length];
      const randomTags = getRandomTags(tags, 15);
      await posting(http, account, filePath, `#${randomTags.join(' #')}`);
      try {
        fs.unlinkSync(filePath);
      } catch(e) { console.log(e) };
      await changeIp(adb, process);
    }
  }, 1000);

  return () => {
    isRepeat = false;
  };
}

export default run;
