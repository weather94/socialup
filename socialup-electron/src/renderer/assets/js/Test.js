/* eslint-disable */
import { Builder, By, until, Capabilities } from 'selenium-webdriver';

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec));
}

async function loadCookie(driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
}

async function run(store, http) {

  http.get('api/instagram/work/kr').then((response) => {
    if (response.data) {
      store.dispatch('saveInstagramWork', response.data);
    }
  });

  const work = await store.state.instagram.instagramWork.reduce(async (acc, cur) => {
    if (acc.followWork && acc.likeWork) {
      return acc;
    } else if (!acc.followWork && cur.type.includes('follow') && !cur.process) {
      const response = await http.get(`api/instagram/work/finish/${cur.id}`)
      if (response.data) {
        acc.followWork = cur;
      } else {
        store.dispatch('removeInstagramWork', cur.id);
      }
    } else if (!acc.likeWork && cur.type.includes('like') && !cur.process) {
      const response = await http.get(`api/instagram/work/finish/${cur.id}`)
      if (response.data) {
        acc.likeWork = cur;
      } else {
        store.dispatch('removeInstagramWork', cur.id);
      }
    }
    return acc;
  }, { followWork: null,  likeWork: null, });
  
  console.log(work);

  // try {
    // const chromeCapabilities = Capabilities.chrome();
    // chromeCapabilities.set('chromeOptions', {
    //   'args': [
    //     // '--headless',
    //     '--disable-gpu',
    //     '--disable-infobars',
    //   ]
    // });
    // const driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    
    // console.log(store.state.account.accounts);
    // const account = store.state.account.accounts.filter(item => item.id === 'ven9_vely0@gmail.com')[0];
    // console.log(account);

    // await driver.get('https://www.instagram.com/?hl=ko');

    // await loadCookie(driver, account.cookie);
    // await driver.get('https://www.instagram.com/?hl=ko');
    // await driver.get('https://www.instagram.com/socialup01/?hl=ko');
    
    // await sleep(1);
    // await driver.findElement(By.xpath("//span[@aria-label='프로필']")).click();

    // await driver.wait(until.elementLocated(By.xpath("//button[text()='프로필 편집']")), 10000);
    // await sleep(1);
    // await driver.findElement(By.xpath("//button[text()='프로필 편집']")).click();

    // await sleep(5);
    // await driver.wait(until.elementLocated(By.xpath('//input[@type="file"]')), 10000);
    // await sleep(1);
    // await driver.findElement(By.xpath('//input[@type="file"]')).sendKeys('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\img\\jpg\\13.jpg');
    
    // await driver.wait(until.elementLocated(By.xpath("//textarea")), 10000);
    // await sleep(1);
    // await driver.findElement(By.xpath("//textarea")).clear();
    // await driver.findElement(By.xpath('//textarea')).sendKeys('asdasdasdasdasdasdasdasd');
    // await sleep(1);
    // await driver.findElement(By.xpath("//button[text()='제출']")).click();
    
  // } catch(e) {
  //   console.log(e);
  // }
}

export default run;
