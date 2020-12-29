/* eslint-disable */
import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import FileStorage from './FileStorage';
import WorkLog from './WorkLog';
import { resetRetrieveHandlers } from 'source-map-support';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
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

async function googleRegister(account) {
  const chromeCapabilities = Capabilities.chrome();
  const args = ['--disable-infobars', '--lang=ko_KR'];
  chromeCapabilities.set('chromeOptions', { args });
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://www.google.com/?hl=ko');
  await driver.wait(until.elementLocated(By.xpath('//a[text()="로그인"]')), 10000);
  await driver.findElement(By.xpath('//a[text()="로그인"]')).click();

  console.log('로그인 클릭');

  await driver.wait(until.elementLocated(By.xpath('//span[text()="계정 만들기"]')), 10000);
  await driver.findElement(By.xpath('//span[text()="계정 만들기"]')).click();
  
  console.log('계정 만들기 클릭');
  await sleep(2);

  await driver.wait(until.elementLocated(By.xpath('//div[text()="본인 계정"]')), 10000);
  await driver.findElement(By.xpath('//div[text()="본인 계정"]')).click();
  
  console.log('본인 계정 클릭');

  await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="성"]')), 10000);
  await driver.findElement(By.xpath('//input[@aria-label="성"]')).sendKeys(account.firstName);
  
  console.log('성 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="이름"]')), 10000);
  await driver.findElement(By.xpath('//input[@aria-label="이름"]')).sendKeys(account.lastName);
  
  console.log('이름 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="사용자 이름"]')), 10000);
  await driver.findElement(By.xpath('//input[@aria-label="사용자 이름"]')).sendKeys(account.loginId);
  
  console.log('사용자 이름 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="비밀번호"]')), 10000);
  await driver.findElement(By.xpath('//input[@aria-label="비밀번호"]')).sendKeys(account.loginPw);
  
  console.log('비밀번호 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="확인"]')), 10000);
  await driver.findElement(By.xpath('//input[@aria-label="확인"]')).sendKeys(account.loginPw);
  
  console.log('확인 클릭');

  await driver.wait(until.elementLocated(By.xpath('//span[text()="다음"]')), 10000);
  await driver.findElement(By.xpath('//span[text()="다음"]')).click();

  await sleep(2);
  
  console.log('다음 클릭');

  await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="전화번호"]')), 10000);
  await driver.findElement(By.xpath('//input[@aria-label="전화번호"]')).sendKeys(account.phone);
  
  console.log('전화번호 입력');

  await driver.wait(until.elementLocated(By.xpath('//span[text()="다음"]')), 10000);
  await driver.findElement(By.xpath('//span[text()="다음"]')).click();
  
  console.log('다음 클릭');

  while(true) {
    try {
      await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="연도"]')), 1000);
      await driver.findElement(By.xpath('//input[@aria-label="연도"]')).sendKeys(account.birthYear);
      break;
    } catch(e) {
      console.log(e);
    }
    await sleep(1);
  }

  await driver.wait(until.elementLocated(By.xpath('//option[text()="3월"]')), 10000);
  await driver.findElement(By.xpath(`//option[text()="${account.birthMonth}월"]`)).click();

  await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="일"]')), 10000);
  await driver.findElement(By.xpath('//input[@aria-label="일"]')).sendKeys(account.birthDate);
  
  await driver.wait(until.elementLocated(By.xpath('//option[text()="공개 안함"]')), 10000);
  await driver.findElement(By.xpath(`//option[text()="공개 안함"]`)).click();

  await driver.wait(until.elementLocated(By.xpath('//span[text()="다음"]')), 10000);
  await driver.findElement(By.xpath('//span[text()="다음"]')).click();
  
  console.log('다음 클릭');

  await driver.wait(until.elementLocated(By.xpath('//button[text()="건너뛰기"]')), 10000);
  await driver.findElement(By.xpath('//button[text()="건너뛰기"]')).click();
  
  console.log('건너뛰기 클릭');
}

async function nateRegister(account) {
  const chromeCapabilities = Capabilities.chrome();
  const args = ['--disable-infobars', '--lang=ko_KR'];
  chromeCapabilities.set('chromeOptions', { args });
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://www.nate.com');
  await driver.wait(until.elementLocated(By.xpath('//a[@href="javascript:onclick_Join();"]')), 10000);
  await driver.findElement(By.xpath('//a[@href="javascript:onclick_Join();"]')).click();
  
  console.log('로그인 클릭');
  await sleep(2);

  await driver.wait(until.elementLocated(By.xpath('//a[@class="normal"]')), 10000);
  await driver.findElement(By.xpath('//a[@class="normal"]')).click();
  
  console.log('계정 만들기 클릭');
  await sleep(2);

  await driver.wait(until.elementLocated(By.xpath('//button[@type="button"]')), 10000);
  await driver.findElement(By.xpath('//button[@type="button"]')).click();
  
  console.log('본인 계정 클릭');

  
  await driver.wait(until.elementLocated(By.xpath('//button[@onclick="goAuth();"]')), 10000);
  await driver.findElement(By.xpath('//button[@onclick="goAuth();"]')).click();

  await driver.wait(until.elementLocated(By.xpath('//input[@id="svc_id"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="svc_id"]')).sendKeys(account.loginId);
  console.log('비밀번호 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="pw"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="pw"]')).sendKeys(account.loginPw);

  await driver.wait(until.elementLocated(By.xpath('//input[@id="pwc"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="pwc"]')).sendKeys(account.loginPw);
  
  console.log('성 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="name"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="name"]')).sendKeys(`${account.lastName}${account.firstName}`);
  
  console.log('이름 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="hp_no_ins"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="hp_no_ins"]')).sendKeys(account.phone);

  await driver.wait(until.elementLocated(By.xpath('//button[em[text()="남자"]]')), 10000);
  await driver.findElement(By.xpath('//button[em[text()="남자"]]')).click();

  
  await driver.findElement(By.xpath('//div[contains(@class, "b_year")]/button')).click();
  await driver.findElement(By.xpath(`//a[text()="${account.birthYear}"]`)).click();

  await driver.findElement(By.xpath('//div[contains(@class, "b_mon")]/button')).click();
  await driver.findElement(By.xpath(`//a[text()="${account.birthMonth}"]`)).click();

  await driver.findElement(By.xpath('//div[contains(@class, "b_day")]/button')).click();
  await driver.findElement(By.xpath(`//a[text()="${account.birthDate}"]`)).click();

  await driver.wait(until.elementLocated(By.xpath('//button[em[text()="Off"]]')), 10000);
  await driver.findElement(By.xpath('//button[em[text()="Off"]]')).click();
}

async function yandexRegister(account) {
  const chromeCapabilities = Capabilities.chrome();
  const args = ['--disable-infobars', '--lang=ko_KR'];
  chromeCapabilities.set('chromeOptions', { args });
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://mail.yandex.com/');
  // await driver.wait(until.elementLocated(By.xpath('//div[text()="Log in"]')), 10000);
  // await driver.findElement(By.xpath('//div[text()="Log in"]')).click();
  // console.log('로그인 클릭');
  // await sleep(2);

  await driver.wait(until.elementLocated(By.xpath('//a[span[text()="Create an account"]]')), 10000);
  await driver.findElement(By.xpath('//a[span[text()="Create an account"]]')).click();
  
  await sleep(3);
 
  await driver.wait(until.elementLocated(By.xpath('//input[@id="firstname"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="firstname"]')).sendKeys(account.firstName);
  
  console.log('성 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="lastname"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="lastname"]')).sendKeys(account.lastName);
  
  console.log('이름 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="login"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="login"]')).sendKeys(account.loginId);
  
  console.log('사용자 이름 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="password"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="password"]')).sendKeys(account.loginPw);
  
  console.log('비밀번호 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="password_confirm"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="password_confirm"]')).sendKeys(account.loginPw);
  
  console.log('확인 클릭');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="phone"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="phone"]')).sendKeys(`+82${account.phone}`);
  
  console.log('전화번호 입력');
}

async function yahooRegister(account) {
  const chromeCapabilities = Capabilities.chrome();
  const args = ['--disable-infobars', '--lang=ko_KR'];
  chromeCapabilities.set('chromeOptions', { args });
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://mail.yahoo.com/');
  // await driver.wait(until.elementLocated(By.xpath('//div[text()="Log in"]')), 10000);
  // await driver.findElement(By.xpath('//div[text()="Log in"]')).click();
  // console.log('로그인 클릭');
  // await sleep(2);

  // await driver.wait(until.elementLocated(By.xpath('//a[text()="계정 생성"]')), 10000);
  // await driver.findElement(By.xpath('//a[text()="계정 생성"]')).click();
  
  await driver.wait(until.elementLocated(By.xpath('//span[text()="회원 가입"]')), 10000);
  await driver.findElement(By.xpath('//span[text()="회원 가입"]')).click();

  await sleep(3);
 
  await driver.wait(until.elementLocated(By.xpath('//input[@id="usernamereg-firstName"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="usernamereg-firstName"]')).sendKeys(account.firstName);
  
  console.log('성 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="usernamereg-lastName"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="usernamereg-lastName"]')).sendKeys(account.lastName);
  
  console.log('이름 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="usernamereg-yid"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="usernamereg-yid"]')).sendKeys(account.loginId);
  
  console.log('사용자 이름 입력');

  await driver.wait(until.elementLocated(By.xpath('//input[@id="usernamereg-password"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="usernamereg-password"]')).sendKeys(account.loginPw);
  
  await driver.wait(until.elementLocated(By.xpath('//option[@data-code="+82"]')), 10000);
  await driver.findElement(By.xpath('//option[@data-code="+82"]')).click();

  await driver.wait(until.elementLocated(By.xpath('//input[@id="usernamereg-phone"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="usernamereg-phone"]')).sendKeys(`${account.phone}`);

  await driver.wait(until.elementLocated(By.xpath(`//option[text()="${account.birthMonth}월"]`)), 10000);
  await driver.findElement(By.xpath(`//option[text()="${account.birthMonth}월"]`)).click();

  await driver.wait(until.elementLocated(By.xpath('//input[@id="usernamereg-day"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="usernamereg-day"]')).sendKeys(`${account.birthDate}`);

  await driver.wait(until.elementLocated(By.xpath('//input[@id="usernamereg-year"]')), 10000);
  await driver.findElement(By.xpath('//input[@id="usernamereg-year"]')).sendKeys(`${account.birthYear}`);
  
  console.log('전화번호 입력');
}


function run() {
  const account = {
    // loginId: 'jun6m1nsu4885',
    // loginPw: 'alstn12!',
    // birthYear: 1987,
    // birthMonth: 3,
    // birthDate: 21,
    // firstName: 'minsu',
    // lastName: 'jung',
    // phone: '01084712364',
    loginId: 'kzh920709k',
    loginPw: 'woghks12!',
    birthYear: 1992,
    birthMonth: 7,
    birthDate: 9,
    firstName: 'kim',
    lastName: 'jeahwan',
    phone: '01096752314',
  };

  // setTimeout(async () => {
  //   await googleRegister(account);
  // }, 1000);

  setTimeout(async () => {
    await nateRegister(account);
  }, 1000);

  setTimeout(async () => {
    await yandexRegister(account);
  }, 1000);

  setTimeout(async () => {
    await yahooRegister(account);
  }, 1000);

  return;
}

export default run;
