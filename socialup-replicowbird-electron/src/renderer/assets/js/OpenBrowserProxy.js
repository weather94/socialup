import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadCookie(driver, cookies) {
  try {
    if (cookies) {
      const _cookies = JSON.parse(cookies);
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


// async function loadCookie(driver, cookies) {
//   const _cookies = JSON.parse(cookies);
//   console.log(_cookies);
//   for (const cookie of _cookies) {
//     await driver.manage().addCookie(cookie);
//   }
// }

async function run(proxy, cookie, mobile) {
  let chromeCapabilities = Capabilities.chrome();
  const args = [
    '--disable-gpu',
    '--disable-infobars',
  ];

  if (proxy) {
    args.push(`--proxy-server=http://${proxy}`);
  }
  
  if (mobile) {
    const mobileEmulation = {
      deviceMetrics: {
        width: 360,
        height: 640,
        pixelRatio: 3.0,
      },
      userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
    };
    chromeCapabilities.set('chromeOptions', { args, mobileEmulation });
  } else {
    chromeCapabilities.set('chromeOptions', { args });
  }

  // console.log(1);
  // let driver2 = await new Builder().forBrowser('firefox').build();
  // console.log(222);
  // let fireDriver = await new Builder().forBrowser('firefox').withCapabilities(Capabilities.firefox()).build();
  // console.log(2);
  // await fireDriver.get('https://www.instagram.com/?hl=ko');
  // console.log(3);
  // if (cookie) {
  //   console.log(4);
  //   await loadCookie(fireDriver, JSON.parse(cookie));
  //   await fireDriver.navigate().refresh();
  // }
  
  let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  await driver.get('https://www.instagram.com/');
  if (cookie) {
    await loadCookie(driver, cookie);
    await driver.navigate().refresh();
  }
}

export default run;
