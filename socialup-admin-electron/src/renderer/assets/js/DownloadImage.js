import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import request from 'request';
import fs from 'fs';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadCookie(driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
}

async function readImageByUrl(url, path) {
  return new Promise((resolve, reject) => {
    let req = null;
    try {
      req = request({
        method: 'GET',
        uri: url,
      });
    } catch(e) {
      console.log(e);
      reject(path);
    }
    const out = fs.createWriteStream(path);
    const stream = req.pipe(out);
    stream.on('finish', () => {
      resolve(path);
    });
    stream.on('error', () => {
      reject(path);
    })
  });
}

function run(tags, path) {
  let driver;
  let isRepeat = true;
  let downloadUrls = [];
  setTimeout(async () => {
    try {
      let chromeCapabilities = Capabilities.chrome();
      chromeCapabilities.set('chromeOptions', {
        'args': [
          `--user-agent=${USER_AGENT}`,
          '--disable-gpu',
          '--disable-infobars',
          '--window-size=400,640',
        ]
      });
      let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
      const splitTag = tags.split(',').map(item => item.trim());
      await driver.get('https://www.instagram.com/?hl=ko');
      
      while (isRepeat) {
        for (const tag of splitTag) {
          await driver.get(`https://www.instagram.com/explore/tags/${tag}/?hl=ko`);
          const data = await driver.executeScript('return _sharedData.entry_data.TagPage[0].graphql.hashtag');
          let urls = data.edge_hashtag_to_media.edges.map(item => item.node.display_url);
          urls = urls.filter(item => !downloadUrls.includes(item)); 
          console.log(`${tag} ${urls.length}`);
          for (const url of urls) {
            if (!isRepeat) break;
            try {
              await readImageByUrl(url, `${path}\\${new Date().getTime()}-${Math.floor(Math.random()*10)}.jpg`);
              downloadUrls.push(url);
            } catch(e) {
              console.log(e);
            }
          }
          await sleep(5);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  return () => {
    isRepeat = false;
    if (driver) {
      try { driver.quit(); } catch(e) { };
    }
    return true;
  }
}

export default run;
