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

async function run(store, http) {

  // const rawMembers = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\movetime24.com\\member.json');
  // const rawOrders = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\movetime24.com\\order.csv', 'binary');
  // const data = iconv.decode(rawOrders, 'EUC_KR').toString().split('\n');
  // const members = JSON.parse(rawMembers);

  // for (let i = 1; i <= data.length; i += 1) {
  //   try {
  //     const item = data[i].split(',');
  //     if (item[4] === '결제확인') {
  //       const id = item[3].replace('회원(', '').replace(')', '');
  //       const member = members.filter(item => item.id === id)[0];
  //       if (member) {
  //         if (!member.amount) {
  //           member.amount = 0;
  //         }
  //         member.amount += Number(item[10]);
  //         if (!member.buy) {
  //           member.buy = [];
  //         }
  //         member.buy.push(item.slice(-1));
  //       } else {
  //         console.log(data[i]);
  //         console.log('없는데?');
  //       }
  //     }
  //   } catch (e) {
  //     console.log(data[i]);
  //   }
  // }
  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\movetime24.com\\member-order.json', JSON.stringify(members));

  // const rawMembers = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\pecle.co.kr\\member-order.json');
  // let member = JSON.parse(rawMembers);
  // console.log(member);
  // member = member.filter(item => item.amount).sort((a, b) => b.amount - a.amount);
  // member.forEach((item) => {
  //   console.log(`${item.name} ${item.contact} ${item.amount}`);
  //   if (item.amount > 1000000) {
  //     console.log(item);
  //   }
  // });
  // console.log(member.length);

  const rawMembers = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\bbs221.net\\member-order.json');
  let member = JSON.parse(rawMembers);
  console.log(member);
  member = member.filter(item => item.amount).sort((a, b) => b.amount - a.amount);
  let members = member.map(item => `${item.name},${item.sex},${item.birth},${item.contact},${item.amount},${item.buy.length}`);
  let count = 0;
  member.forEach(item => count += item.buy.length);
  console.log(count);
  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\bbs221.net\\member-order-simple.csv', members.join('\n'));

  // const rawMembers = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\pecle.co.kr\\member.json');
  // const rawOrders = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\pecle.co.kr\\order.csv', 'binary');
  // const data = iconv.decode(rawOrders, 'EUC_KR').toString().split('\n');
  // const members = JSON.parse(rawMembers);

  // for (let i = 1; i <= data.length; i += 1) {
  //   try {
  //     const item = data[i].split(',');
  //     const state = item.slice(-11, -10)[0];
  //     if (state !== '주문접수' && state !== '반품or취소완료') {
  //       const id = item[3].replace('회원(', '').replace(')', '');
  //       const contacts = [item[3], item[4], ...item.slice(-6, -4)];
  //       const member = members.filter(item => contacts.includes(item.contact))[0];
  //       if (member) {
  //         if (!member.amount) {
  //           member.amount = 0;
  //         }
  //         member.amount += Number(item.slice(-14, -13)[0]);
  //         if (!member.buy) {
  //           member.buy = [];
  //         }
  //         member.buy.push(item.slice(-19, -18)[0]);
  //       } else {
  //         console.log('없는데??');
  //       }
  //     }
  //   } catch (e) {
  //     console.log(data[i]);
  //   }
  // }
  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\pecle.co.kr\\member-order.json', JSON.stringify(members));

  // const members = JSON.parse(raws);
  // const meta = 'Name,Given Name,Given Name Yomi,Family Name,Yomi Name,Additional Name,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Group Membership,E-mail 1 - Type,E-mail 1 - Value,Phone 1 - Type,Phone 1 - Value,Phone 2 - Type,Phone 2 - Value,Phone 3 - Type,Phone 3 - Value,Address 1 - Type,Address 1 - Formatted,Address 1 - Street,Address 1 - City,Address 1 - PO Box,Address 1 - Region,Address 1 - Postal Code,Address 1 - Country,Address 1 - Extended Address,Organization 1 - Type,Organization 1 - Name,Organization 1 - Yomi Name,Organization 1 - Title\n';
  
  // for (let i = 1; i < 2; i += 1) {
  //   const text = members.slice(i*10000, (i + 1)*10000).map((item) => {
  //   if (item.contact && item.name) {
  //     let contact = null;
  //     if (item.contact) {
  //       contact = item.contact.replace(/-/g, '').replace('\n', '').trim();
  //     } else {
  //       contact = item.contact.trim();
  //     }
  //     if (contact.length === 10 || contact.length === 11) {
  //       return `BEGIN:VCARD\nVERSION:2.1\nN:${item.name};;;;\nFN:${item.name}\nTEL;CELL:${contact}\nEND:VCARD`
  //     } else {
  //       return null;
  //     }
  //   } else {
  //     return null;
  //   }
    
  //   // return `${item.name},,,,,,,,,,,,,,,,,,,,,,,,,${item.id},,,${item.email},,${contact},,,,,,,,,,,,,,,,,`
  //   // return `${item.name},${contact},${item.sex},${item.birth},${item.id},${item.email}`
  // }).filter(item => item).join('\n');
  
  // fs.writeFileSync(`C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\member${i*10000}-${(i + 1)*10000}.txt`, text);
  // }
  
  
  // const raws = fs.readFileSync(`C:\\Users\\chlrl\\Downloads\\products.csv`).toString();
  // const dirs = fs.readdirSync('C:\\workspace\\project\\socialup\\socialup-admin-electron\\watch');
  
  // for (let i = 0; i < dirs.length; i += 1) {
  //   if (!raws.includes(dirs[i])) {
  //     fs.unlinkSync(`C:\\workspace\\project\\socialup\\socialup-admin-electron\\watch\\${dirs[i]}`);
  //   }
  // }
  // console.log('끝');



  // const raws = fs.readFileSync(`C:\\Users\\chlrl\\Downloads\\products.csv`).toString();
  // const items = raws.match(/i[0-9-]*\.jpg/);
  // console.log(items);

  // const members = JSON.parse(fs.readFileSync(`C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\all-member.json`));
  // for (let i = 0; i < members.length; i += 1) {
  //   if (members[i].site.length > 1) {
  //     console.log(members[i]);
  //   }
  // }

  // console.log(members.filter(item => item.site.length === 1));
  // console.log(members.filter(item => item.site.length === 2));
  // console.log(members.filter(item => item.site.length === 3));
  // console.log(members.filter(item => item.site.length === 4));
  // console.log(members.filter(item => item.site.length > 4));

  // const folders = fs.readdirSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db');
  // const members = [];
  // for (let i = 0; i < folders.length; i += 1) {
  //   console.log(folders[i]);
  //   const rawMembers = fs.readFileSync(`C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\${folders[i]}\\member.json`);
  //   const mems = JSON.parse(rawMembers);
  //   for (let j = 0; j < mems.length; j += 1) {
  //     const member = members.filter(item => item.contact === mems[j].contact)[0];
  //     if (member) {
  //       if (!member.site.includes(folders[i])) {
  //         member.site.push(folders[i]);
  //       }
  //     } else {
  //       members.push({
  //         ...mems[j],
  //         site: [folders[i]],
  //       });
  //     }
  //   }
  // }
  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\all-member.json', JSON.stringify(members));
  
  // const rawMembers = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\hkmpcatch.kr\\member.txt');
  // const data = iconv.decode(rawMembers, 'EUC_KR').toString().split('\n');
  // const data = rawMembers.toString().split('\n');
  // console.log(data);
  // const members = [];
  // for (let i = 1; i <= data.length; i += 1) {
  //   try {
  //     let _member = data[i].split('\t');
  //     const member = {
  //       id: _member[3],
  //       name: _member[5],
  //       sex: (_member[8] === "1") ? '남성' : (_member[8] === "2") ? '여성' : '',
  //       contact: _member[18],
  //       address: `${_member[14]} ${_member[15]}`,
  //       birth: _member[9],
  //       email: _member[11],
  //     }
  //     members.push(member);
  //   } catch (e) {
  //     console.log(data[i]);
  //   }
  // }
  // console.log(members);
  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\hkmpcatch.kr\\member.json', JSON.stringify(members));

  // const rawMembers = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\style7982.com\\member.csv', 'binary');
  // const data = iconv.decode(rawMembers, 'EUC_KR').toString().split('\n');
  // console.log(data);
  // const members = [];
  // for (let i = 1; i <= data.length; i += 1) {
  //   try {
  //     const _member = data[i].split(',');
  //     const member = {
  //       id: _member[2],
  //       name: _member[3],
  //       sex: _member[4],
  //       contact: (_member[7]) ? _member[7] : _member[6],
  //       address: _member[9],
  //       birth: _member[5],
  //       email: _member[8],
  //     }
  //     members.push(member);
  //   } catch (e) {
  //     console.log(data[i]);
  //   }
  // }
  // console.log(members);
  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\style7982.com\\member.json', JSON.stringify(members));

  // const rawMembers = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\percle\\퍼펙트클론member_list20190708.csv', 'binary');
  // const rawOrders = fs.readFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\percle\\퍼펠트클론order_list_all_excel20190708.csv', 'binary');
  // const data = iconv.decode(rawMembers.toString(), 'EUC_KR').toString().split('\n');
  // const orderData = iconv.decode(rawOrders.toString(), 'EUC_KR').toString().split('\n');
  // const meta = data[0].split(',');
  // const orderMeta = orderData[0].split(',');
  // let members = [];
  // for (let i = 1; i < data.length; i += 1) {
  //   const result = {};
  //   const item = data[i].split(',');
  //   for (let j = 0; j < meta.length; j += 1) {
  //     result[meta[j]] = item[j];
  //   }
  //   members.push(result);
  // }
  // console.log(members);

  // for (let i = 1; i < orderData.length; i += 1) {
  //   const result = {};
  //   const item = orderData[i].split(',');
  //   for (let j = 0; j < meta.length; j += 1) {
  //     result[orderMeta[j]] = item[j];
  //   }
  //   const filterMember = members.filter(item => item['이메일'] === result['이메일'])[0];
  //   if (filterMember) {
  //     if (!filterMember['주문내역']) {
  //       filterMember['주문내역'] = [];
  //     } else {
  //       filterMember['주문내역'].push(result);
  //     }
  //   } else {
  //     console.log('없다는데?');
  //   }
  // }

  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\percle\\merge.txt', JSON.stringify(members));



  // for (let i = 1; i < 5000; i += 1) {
  //   const arr = data[i].split(',');
  //   const contact2 = (a.length > b.length) ? a : b;
  //   if (contact !== contact2) {
  //     console.log(i);
  //     console.log(contact);
  //     console.log(contact2);
  //   }
  //   // console.log(contact );
  //   // if (!result[contact]) {
  //   //   result[contact] = {

  //   //   }
  //   // }
  // }
  // console.log(data.length);

  // fs.writeFileSync('C:\\Users\\chlrl\\OneDrive\\바탕 화면\\db\\asd.txt', data);
  
  //.///////////////////////////////////////////// 워터마크 박기

  // let files = fs.readdirSync('C:\\Users\\chlrl\\AppData\\Roaming\\Electron\\detail'); 

  // const watermark = await jimp.read(`C:\\Users\\chlrl\\AppData\\Roaming\\Electron\\decade-watermark.png`);
  // // for (let i=0; i<files.length; i++) {
  // for (let i=0; i<10; i++) {
  //   console.log(files[i]);
  //   const image = await jimp.read(`C:\\Users\\chlrl\\AppData\\Roaming\\Electron\\detail\\${files[i]}`);
  //   watermark.resize(image.bitmap.width, jimp.AUTO);
  //   image.blit(watermark, 0, 0).write(`C:\\Users\\chlrl\\AppData\\Roaming\\Electron\\detailW\\${files[i]}`);
  // }

  ////////////////////////////////////////// 중복되거나 잘못가져온 이미지 삭제
  // let files = fs.readdirSync('C:\\Users\\chlrl\\AppData\\Roaming\\Electron\\detail'); // 디렉토리를 읽어온다
  // console.log(files);

  // let watchCategory = _.cloneDeep(store.state.flag.storage.watchCategory);
  // let images = [];
  // for (let i=0; i<watchCategory.length; i++) {
  //   const cate = watchCategory[i];

  //   if (cate.category) {
  //     for (let item of cate.category) {
  //       for (let product of item.products) {
  //         if (product.images) {
  //           images = images.concat(product.images);
  //         }
  //       }
  //     }
  //   } else {
  //     for (let product of cate.products) {
  //       if (product.images) {
  //         images = images.concat(product.images);
  //       }
  //     }
  //   }
  // }
  // images = images.map(item => item.replace('C:\\Users\\chlrl\\AppData\\Roaming\\Electron\\detail\\', ''));


  // console.log(images);

  // for (let i=0; i<files.length; i++) {
  //   if (images.includes(files[i])) {
  //     console.log('포함');
  //   } else {
  //     fs.unlink(`C:\\Users\\chlrl\\AppData\\Roaming\\Electron\\detail\\${files[i]}`, function() {
  //       console.log('안포함 삭제~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  //     });
  //   }
  // }


  ////////////////////////////////////////// 제일큰 카테고리 가져오기
  // const data = [];
  // await driver.get('http://tophongkong.co.kr/product-category/%EC%8B%9C%EA%B3%84/');

  // const category = (await driver.findElements(By.xpath('//li[contains(@class, "product-category")]')));

  // for (let i=0; i<category.length; i++) {
  //   const item = category[i];
  //   console.log(item);
  //   data.push({
  //     file: await readImageByUrl(await item.findElement(By.css('a img')).getAttribute('src'), 'category'),
  //     name: await item.findElement(By.css('a h2')).getText(),
  //     url: await item.findElement(By.css('a')).getAttribute('href'),
  //   });
  // }


  //////////////////////////////////////// 세부카테고리 긁어오기
  // let watchCategory = _.cloneDeep(store.state.flag.storage.watch);
  // console.log(watchCategory);

  // for (let i=0; i<watchCategory.length; i++) {
  //   const cate = watchCategory[i];
  //   await driver.get(cate.url);

  //   try {
  //     const category = (await driver.findElements(By.xpath('//li[contains(@class, "product-category")]')));
  //     for (let i=0; i<category.length; i++) {
  //       if (!cate.category) {
  //         cate.category = [];
  //       }
  //       const item = category[i];
  //       console.log(item);
  //       cate.category.push({
  //         file: await readImageByUrl(await item.findElement(By.css('a img')).getAttribute('src'), 'category'),
  //         name: await item.findElement(By.css('a h2')).getText(),
  //         url: await item.findElement(By.css('a')).getAttribute('href'),
  //       });
  //   }
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }


  /////////////////////////////////////////////////////////// 제품 and 섬네일 긁어오기
  // let watchCategory = _.cloneDeep(store.state.flag.storage.watchCategory);
  // console.log(watchCategory);

  // for (let i=0; i<watchCategory.length; i++) {
  //   console.log(`processing... ${i}/${watchCategory.length} (${Math.round(i/watchCategory.length*100)}%)`)
  //   const cate = watchCategory[i];

  //   if (cate.category) {
  //     for (let item of cate.category) {
  //       await driver.get(item.url);
  //       item.products = [];
  //       while(true) {
  //         const products = await driver.findElements(By.xpath('//li[contains(@class, "product")][contains(@class, "type-product")]'));
  //         for (let product of products) {
  //           let price1 = null;
  //           let price2 = null;
  //           try {
  //             price1 = (await product.findElement(By.css('a del')).getText()).replace(' ', '').replace('₩', '').replace(',', '');
  //             price2 = (await product.findElement(By.css('a ins')).getText()).replace(' ', '').replace('₩', '').replace(',', '');
  //           } catch(e) {
  //             price2 = (await product.findElement(By.css('a span.price')).getText()).replace(' ', '').replace('₩', '').replace(',', '');
  //           }
  //           const _product = {
  //             file: await readImageByUrl(await product.findElement(By.css('a img')).getAttribute('src'), 'watch'),
  //             name: await product.findElement(By.css('a h2')).getText(),
  //             url: await product.findElement(By.css('a.woocommerce-LoopProduct-link.woocommerce-loop-product__link')).getAttribute('href'),
  //             price1,
  //             price2,
  //           };
  //           console.log(_product);
  //           item.products.push(_product);
  //         }
  //         try {
  //           await driver.get(await driver.findElement(By.xpath(' //a[contains(@class, "next")]')).getAttribute('href'));
  //         } catch(e) {
  //           break;
  //         }
  //       }
  //     }
  //   } else {
  //     await driver.get(cate.url);
  //     cate.products = [];
  //     while(true) {
  //       const products = await driver.findElements(By.xpath('//li[contains(@class, "product")][contains(@class, "type-product")]'));
  //       for (let product of products) {
  //         let price1 = null;
  //         let price2 = null;
  //         try {
  //           price1 = (await product.findElement(By.css('a del')).getText()).replace(' ', '').replace('₩', '').replace(',', '');
  //           price2 = (await product.findElement(By.css('a ins')).getText()).replace(' ', '').replace('₩', '').replace(',', '');
  //         } catch(e) {
  //           price2 = (await product.findElement(By.css('a span.price')).getText()).replace(' ', '').replace('₩', '').replace(',', '');
  //         }
  //         const _product = {
  //           file: await readImageByUrl(await product.findElement(By.css('a img')).getAttribute('src'), 'watch'),
  //           name: await product.findElement(By.css('a h2')).getText(),
  //           url: await product.findElement(By.css('a.woocommerce-LoopProduct-link.woocommerce-loop-product__link')).getAttribute('href'),
  //           price1,
  //           price2,
  //         };
  //         console.log(_product);
  //         cate.products.push(_product);
  //       }
  //       try {
  //         await driver.get(await driver.findElement(By.xpath(' //a[contains(@class, "next")]')).getAttribute('href'));
  //       } catch(e) {
  //         break;
  //       }
  //     }
    // }
  //   store.dispatch('addData', {
  //     key: 'watchCategory',
  //     value: _.cloneDeep(watchCategory),
  //   });
  // }


  ////////////////////////////////////////// 세부이미지 전체다긁어오기
  // let watchCategory = _.cloneDeep(store.state.flag.storage.watchCategory);
  // console.log(watchCategory);

  // for (let i=0; i<watchCategory.length; i++) {
  //   console.log(`processing... ${i}/${watchCategory.length} (${Math.round(i/watchCategory.length*100)}%)`)
  //   const cate = watchCategory[i];

  //   if (cate.category) {
  //     for (let item of cate.category) {
  //       for (let product of item.products) {
  //         console.log(product.name);
  //         if (product.images) {
  //           continue;
  //         } else {
  //           product.images = [];
  //         }
  //         await driver.get(product.url);
  //         const list = await driver.executeScript('return [...document.querySelectorAll("p img")].map(item => item.src);');
  //         for (let url of list) {
  //           if (!url.includes('http://hkm911.godohosting.com/watch/main/main')) {
  //             while (true) {
  //               try {
  //                 console.log(url);
  //                 product.images.push(await readImageByUrl(url, 'detail'));
  //                 break;
  //               } catch(e) {
  //                 console.log(e);
  //                 if (e === 'nosite') {
  //                   break;
  //                 }
  //                 await sleep(1000);
  //               }
  //             }
  //           }
  //         }
  //         store.dispatch('addData', {
  //           key: 'watchCategory',
  //           value: _.cloneDeep(watchCategory),
  //         });
  //       }
  //     }
  //   } else {
  //     for (let product of cate.products) {
  //       console.log(product.name);
  //       if (product.images) {
  //         continue;
  //       } else {
  //         product.images = [];
  //       }
  //       await driver.get(product.url);
  //       const list = await driver.executeScript('return [...document.querySelectorAll("p img")].map(item => item.src);');
  //       for (let url of list) {
  //         if (!url.includes('http://hkm911.godohosting.com/watch/main/main')) {
  //           while (true) {
  //             try {
  //               console.log(url);
  //               product.images.push(await readImageByUrl(url, 'detail'));
  //               break;
  //             } catch(e) {
  //               console.log(e);
  //               if (e === 'nosite') {
  //                 break;
  //               }
  //               await sleep(1000);
  //             }
  //           }
  //         }
  //       }
  //       store.dispatch('addData', {
  //         key: 'watchCategory',
  //         value: _.cloneDeep(watchCategory),
  //       });
  //     }
  //   }
  // }
  


  // store.dispatch('addData', {
  //   key: 'watchCategory',
  //   value: _.cloneDeep(watchCategory),
  // });



  // ////////////////////////////////////////////////////////////////////////////// cafe24 글올리기
  // await driver.get('https://eclogin.cafe24.com/Shop/');

  // await driver.findElement(By.xpath('//input[@name="mall_id"]')).sendKeys("qwer12345678901");
  // await driver.findElement(By.xpath('//input[@name="userpasswd"]')).sendKeys("wkssm*()");
  // await driver.findElement(By.xpath('//a[@class="btnSubmit"]')).click();

  // await driver.wait(until.elementLocated(By.xpath('//a[@id="QA_Gnb_store"]')), 20000);

  // const path = 'C:\\Users\\chlrl\\Downloads\\refle';
  // const fileList = await fs.readdirSync(path);
  // try {
  //   for (let file of fileList) {
  //     await driver.get('http://qwer12345678901.cafe24.com/disp/admin/shop1/product/ProductSimpleRegister');
  //     await driver.wait(until.elementLocated(By.xpath('//strong[@class="icoRequired"]')), 20000);
  
  //     console.log(`${path}\\${file}`);
  //     await driver.findElement(By.xpath('//input[@name="product_name"]')).sendKeys(file);
  //     await driver.findElement(By.xpath('//input[@name="summary_desc"]')).sendKeys(file);
  //     await driver.findElement(By.xpath('//input[@id="product_price"]')).sendKeys(Math.floor(Math.random() * 100) * 5000);
  
  //     await driver.findElement(By.xpath('//input[@name="is_display[1]"]')).click();
  //     await driver.findElement(By.xpath('//input[@name="selling_status[1]"]')).click();
  
  //     await sleep(1000);
  //     await driver.findElement(By.xpath('//li[contains(text(), "Accessories")]')).click();
  //     await sleep(1000);
  //     await driver.findElement(By.xpath('//li[contains(text(), "시계")]')).click();
  //     await sleep(1000);
  //     await driver.findElement(By.xpath('//li[contains(text(), "롤렉스")]')).click();
  //     await sleep(1000);
  //     await driver.findElement(By.xpath('//a[contains(@class, "imageupload")]')).click();
  //     await sleep(1000);
  //     await driver.findElement(By.xpath('//input[@id="imageFiles"]')).sendKeys(`${path}\\${file}`);
  //     await sleep(1000);
  //     await driver.findElement(By.xpath('//a[span[contains(text(), "상품등록")]]')).click();
  //     await sleep(2000);
  //     await driver.switchTo().alert().accept();
    // }
  // } catch (e) {
  //   await takeScreenshot(driver, 'error');
  //   throw e;
  // }

}

export default run;
