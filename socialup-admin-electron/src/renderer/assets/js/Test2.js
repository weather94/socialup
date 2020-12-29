/* eslint-disable */
import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import electron, { clipboard } from 'electron';
import request from 'request';
import fs from 'fs';
import * as _ from 'lodash';
import clipboardy from 'clipboardy';
import jimp from 'jimp';
import iconv from 'iconv-lite';

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec));
}

function rsleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec*1000 + (Math.random()*1000)));
}

async function loadCookie(driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
}

async function takeScreenshot(driver, name) {
  await driver.takeScreenshot().then(
    function(image, err) {
        require('fs').writeFile(`${name}-${new Date().getTime()}.png`, image, 'base64', function(err) {
            console.log(err);
        });
    }
  );
}

async function readImageByUrl(url, folder) {
  return new Promise((resolve, reject) => {
    try {
      let userDataPath = (electron.app || electron.remote.app).getPath('userData');
      userDataPath = userDataPath + `\\${folder}\\img${new Date().getTime()}-${Math.floor(Math.random()*1000)}.jpg`;
    
      const req = request({
        method: 'GET',
        uri: url,
      })
      req.on( 'error', function(err){
        reject('nosite');
      });
      const out = fs.createWriteStream(userDataPath);
      const stream = req.pipe(out);
      stream.on('finish', async () => {
        resolve(userDataPath);
      });
    } catch(e) {
      reject('error');
    }
  });
}

async function delaySendKeys(driver, xpath, keys) {
  for (let i = 0; i < keys.length; i++) {
    await driver.findElement(By.xpath(xpath)).sendKeys(keys[i]);
    await sleep(Math.random()*100);
  }
}

async function run(store, http) {
  
  const folderPath = 'C:\\Users\\chlrl\\OneDrive\\바탕 화면\\mg\\shoes';
  const dirs = fs.readdirSync(folderPath);
  console.log(dirs.length);
  for (let i = 0; i < dirs.length; i++) {
      const folderName = dirs[i];
      const folderPath2 = `${folderPath}\\${folderName}`;
      const dirs2 = fs.readdirSync(folderPath2);
      fs.renameSync(folderPath2, `${folderPath2} ${dirs2.length}`);
  }
  // const folderPath = 'C:\\workspace\\sh2';
  // const newPath = 'C:\\Users\\chlrl\\OneDrive\\바탕 화면\\mg\\shoes';
  // const dirs = fs.readdirSync(folderPath);
  // for (let i = 0; i < dirs.length; i++) {
  //   const folderName = dirs[i];
  //   let value = '';

  //   if (folderName.includes('알렌산더맥퀸') || folderName.includes('알렉산더 맥퀸') || folderName.includes('알렉산맥퀸') || (!folderName.includes('알렉산더맥퀸') && folderName.includes('맥퀸') || folderName.includes('알렉산더'))) {
  //     if (!fs.existsSync(`${newPath}\\알렉산더맥퀸`)) {
  //       fs.mkdirSync(`${newPath}\\알렉산더맥퀸`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\알렉산더맥퀸\\${folderName} s2`);
  //   }

  //   const brands = ['알렉산더맥퀸', '펜디', '발리', '보테가베네타', '돌체엔가바나', '구찌', '루이비통', '프라다', '에르메스', '베르사체', '발렌티노', '오프화이트', '지방시', '발렌시아가', '알마니', '버버리', '페레가모', '쥬세페자노티', '필립플레인', '디올', '톰포드', '골든구스', '부세미', '톰브라운', '샤넬', '릭오웬스', '토즈', '나이키', '발망', '몽클레어', '제냐', '벨루티', 'Y-3', '조던', '겐조', '미우미우', '로저비비에', '로에베', '바이파', '세인트로랑', '셀린느', '지미추', '크리스찬루부탱', '카사데이', '아크네스튜디오', '호간', '스튜어트와이츠먼', '지안비토로시', '질샌더', '컬트가이아', '세르지오로시', '끌로에', '마놀로블라닉', '커먼프로젝트', '자크뮈스', '폴앤드류', '르네카오빌라', '더로우', '누스', '니콜라스커크우드', '스텔라매카트니', '마르니', '모스키노', '엠파슨스', '파텍필립'];
  //   for (let i = 0; i < brands.length; i++) {
  //     const value = brands[i];  
  //     if (folderName.includes(value)) {
  //       if (!fs.existsSync(`${newPath}\\${value}`)) {
  //         fs.mkdirSync(`${newPath}\\${value}`);
  //       }
  //       fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\${value}\\${folderName} s2`);
  //     }
  //   }

  //   if (folderName.includes('Bally') || folderName.includes('BALLY')) {
  //     if (!fs.existsSync(`${newPath}\\발리`)) {
  //       fs.mkdirSync(`${newPath}\\발리`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\발리\\${folderName} s2`);
  //   }

  //   if (folderName.includes('LOUlS  VUlTTON') || folderName.includes('LV ')) {
  //     if (!fs.existsSync(`${newPath}\\루이비통`)) {
  //       fs.mkdirSync(`${newPath}\\루이비통`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\루이비통\\${folderName} s2`);
  //   }

  //   if (folderName.includes('아르마니')) {
  //     if (!fs.existsSync(`${newPath}\\알마니`)) {
  //       fs.mkdirSync(`${newPath}\\알마니`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\알마니\\${folderName} s2`);
  //   }

  //   if (folderName.includes('OFF White') || folderName.includes('OFF-WHITE')) {
  //     if (!fs.existsSync(`${newPath}\\오프화이트`)) {
  //       fs.mkdirSync(`${newPath}\\오프화이트`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\오프화이트\\${folderName} s2`);
  //   }

  //   if (folderName.includes('Versac') || folderName.includes('Versace')) {
  //     if (!fs.existsSync(`${newPath}\\베르사체`)) {
  //       fs.mkdirSync(`${newPath}\\베르사체`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\베르사체\\${folderName} s2`);
  //   }

  //   if (!folderName.includes('보테가베네타') && (folderName.includes('보테가') || folderName.includes('BOTTEGA  VENETA'))) {
  //     if (!fs.existsSync(`${newPath}\\보테가베네타`)) {
  //       fs.mkdirSync(`${newPath}\\보테가베네타`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\보테가베네타\\${folderName} s2`);
  //   }

  //   if (folderName.includes('돌체앤가바나')) {
  //     const name = '돌체엔가바나';
  //     if (!fs.existsSync(`${newPath}\\${name}`)) {
  //       fs.mkdirSync(`${newPath}\\${name}`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\${name}\\${folderName} s2`);
  //   }

  //   if (folderName.includes('Ferragamo') || folderName.includes('페라가모')) {
  //     const name = '페레가모';
  //     if (!fs.existsSync(`${newPath}\\${name}`)) {
  //       fs.mkdirSync(`${newPath}\\${name}`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\${name}\\${folderName} s2`);
  //   }

  //   if (!folderName.includes('발렌시아가') && folderName.includes('발렌시아')) {
  //     const name = '발렌시아가';
  //     if (!fs.existsSync(`${newPath}\\${name}`)) {
  //       fs.mkdirSync(`${newPath}\\${name}`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\${name}\\${folderName} s2`);
  //   }

  //   if (folderName.includes('YEEZY') || folderName.includes('Yeezy') || folderName.includes('이지부스트')) {
  //     const name = '이지';
  //     if (!fs.existsSync(`${newPath}\\${name}`)) {
  //       fs.mkdirSync(`${newPath}\\${name}`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\${name}\\${folderName} s2`);
  //   }

  //   if (folderName.includes('디오르옴므')) {
  //     const name = '디올';
  //     if (!fs.existsSync(`${newPath}\\${name}`)) {
  //       fs.mkdirSync(`${newPath}\\${name}`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\${name}\\${folderName} s2`);
  //   }

  //   if (folderName.includes('크리스찬 루부탱') || folderName.includes('christian louboutin')) {
  //     const name = '크리스찬루부탱';
  //     if (!fs.existsSync(`${newPath}\\${name}`)) {
  //       fs.mkdirSync(`${newPath}\\${name}`);
  //     }
  //     fs.renameSync(`${folderPath}\\${folderName}`, `${newPath}\\${name}\\${folderName} s2`);
  //   }
  // }
  // fs.renameSync(folderPath, `C:\\Users\\chlrl\\OneDrive\\바탕 화면\\mg\\z`);
  // const folderPath = 'C:\\Users\\chlrl\\OneDrive\\바탕 화면\\mg\\bada';
  // const dirs = fs.readdirSync(folderPath);
  // for (let i = 0; i < dirs.length; i++) {
  //   const filePath = `C:\\Users\\chlrl\\OneDrive\\바탕 화면\\mg\\bada\\${dirs[i]}`;
  //   const files = fs.readdirSync(filePath);
  //   console.log(files);
  //   for (let j = 0; j < files.length; j++) {
  //     const folderName = `${dirs[i]} ${files[j].slice(-8, -4)}`;
  //     console.log(folderName);
  //     fs.mkdirSync(`C:\\Users\\chlrl\\OneDrive\\바탕 화면\\mg\\bada\\move\\${folderName}`);
  //     fs.renameSync(`${filePath}\\${files[j]}`, `C:\\Users\\chlrl\\OneDrive\\바탕 화면\\mg\\bada\\move\\${folderName}\\${files[j]}`);
  //   }
  // }
}

export default run;
