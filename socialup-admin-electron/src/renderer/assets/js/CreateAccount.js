import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import WorkLog from './WorkLog';
import publicIP from 'public-ip';
import fs from 'fs';
import electron, { clipboard } from 'electron';
import request from 'request';
import clipboardy from 'clipboardy';
import appiumADB from 'appium-adb';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
const CHECK_TIME = 60*10*1000;
const familyNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
const nameChar = ["가", "강", "건", "경", "고", "관", "광", "구", "규", "근", "기", "길", "나", "남", "노", "누", "다",
              "단", "달", "담", "대", "덕", "도", "동", "두", "라", "래", "로", "루", "리", "마", "만", "명", "무", "문", "미", "민", "바", "박",
              "백", "범", "별", "병", "보", "빛", "사", "산", "상", "새", "서", "석", "선", "설", "섭", "성", "세", "소", "솔", "수", "숙", "순",
              "숭", "슬", "승", "시", "신", "아", "안", "애", "엄", "여", "연", "영", "예", "오", "옥", "완", "요", "용", "우", "원", "월", "위",
              "유", "윤", "율", "으", "은", "의", "이", "익", "인", "일", "잎", "자", "잔", "장", "재", "전", "정", "제", "조", "종", "주", "준",
              "중", "지", "진", "찬", "창", "채", "천", "철", "초", "춘", "충", "치", "탐", "태", "택", "판", "하", "한", "해", "혁", "현", "형",
              "혜", "호", "홍", "화", "환", "회", "효", "훈", "휘", "희", "운", "모", "배", "부", "림", "봉", "혼", "황", "량", "린", "을", "비",
              "솜", "공", "면", "탁", "온", "디", "항", "후", "려", "균", "묵", "송", "욱", "휴", "언", "령", "섬", "들", "견", "추", "걸", "삼",
              "열", "웅", "분", "변", "양", "출", "타", "흥", "겸", "곤", "번", "식", "란", "더", "손", "술", "훔", "반", "빈", "실", "직", "흠",
              "흔", "악", "람", "뜸", "권", "복", "심", "헌", "엽", "학", "개", "롱", "평", "늘", "늬", "랑", "얀", "향", "울", "련"];

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

async function takeScreenshot(driver, error) {
  await driver.takeScreenshot().then(
      function(image, err) {
          require('fs').writeFile(`${error}-${new Date().getTime()}.png`, image, 'base64', function(err) {
              console.log(err);
          });
      }
  );
}

async function loadCookie(driver, cookies) {
  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }
}

async function changeIpNoOverlap(adb, process, accounts) {
  while (true) {
    process.isChangeIp = true;
    try {
      await adb.shell(' su -c "settings put global airplane_mode_on 1"');
      await adb.shell(' su -c "am broadcast -a android.intent.action.AIRPLANE_MODE"');
      await adb.shell(' su -c "settings put global airplane_mode_on 0"');
      await adb.shell(' su -c "am broadcast -a android.intent.action.AIRPLANE_MODE"');
    } catch (e) {
      // console.log(e);
    }

    try {
      await adb.broadcastAirplaneMode();
      await adb.setAirplaneMode(false);
      await adb.broadcastAirplaneMode();
      await adb.setAirplaneMode(true);
    } catch (e) {
      // console.log(e);
    }
    process.ip = await publicIP.v4();
    process.isChangeIp = false;

    const result = accounts.filter(account => account.regIp === process.ip)[0];
    if (result) {
      console.log(`이미 가입된 아이피입니다. 다시변경하겠다 ${process.ip}`);
    } else {
      console.log(`새로운 아이피! ${process.ip}`);
      break;
    }
  }
}

async function changeIp(adb, process) {
  process.isChangeIp = true;
  try {
    await adb.shell(' su -c "settings put global airplane_mode_on 1"');
    await adb.shell(' su -c "am broadcast -a android.intent.action.AIRPLANE_MODE"');
    await adb.shell(' su -c "settings put global airplane_mode_on 0"');
    await adb.shell(' su -c "am broadcast -a android.intent.action.AIRPLANE_MODE"');
  } catch (e) {
    // console.log(e);
  }

  try {
    await adb.broadcastAirplaneMode();
    await adb.setAirplaneMode(false);
    await adb.broadcastAirplaneMode();
    await adb.setAirplaneMode(true);
  } catch (e) {
    // console.log(e);
  }
  process.ip = await publicIP.v4();
  process.isChangeIp = false;
}

// async function changeIp(adb, process) {
//   if (!process.isChangeIp) {
//     process.isChangeIp = true;
//     await adb.broadcastAirplaneMode();
//     await adb.setAirplaneMode(false);
//     await adb.broadcastAirplaneMode();
//     await adb.setAirplaneMode(true);
//     process.ip = await publicIP.v4();
//     process.isChangeIp = false;
//   }
// }

function createRandomPassword() {
  const length = 6 + Math.random()*6;
  let password = '';
  for (let i = 0; i < length; i++) {
    password = password + String.fromCharCode(Math.floor(Math.random()*94) + 33); 
  }
  return password;
}

function randomChar() {
  return String.fromCharCode(Math.floor(Math.random()*26+97));
}

function createRandomKoreanName() {
  const familyName = familyNames[Math.floor(Math.random()*familyNames.length)];
  const firstName = nameChar[Math.floor(Math.random()*nameChar.length)];
  const lastName = nameChar[Math.floor(Math.random()*nameChar.length)];
  return `${familyName}${firstName}${lastName}`
}

function createRandomName(name) {
  const random = Math.random()*100; 
  if (random > 50) {
    return '';
  } else if (random < 25) {
    return createRandomKoreanName();
  } else { 
    return name;
  }
}

async function readImageByUrl(url) {
  return new Promise((resolve, reject) => {
    let userDataPath = (electron.app || electron.remote.app).getPath('userData');
    userDataPath = userDataPath + '\\img.jpg';
  
    const req = request({
      method: 'GET',
      uri: url,
    })

    const out = fs.createWriteStream(userDataPath);
    const stream = req.pipe(out);
    stream.on('finish', async () => {
      resolve(userDataPath);
    });
  });
}

async function clickFollow(driver) {
  try {
    await driver.findElement(By.xpath('//div[@class="bY2yH"]/button[text()="팔로우"] | //div[@class="bY2yH"]/button[text()="Follow"]')).click();
    await sleep(2);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath('//div[@class="bY2yH"]/button[text()="팔로잉"] | //div[@class="bY2yH"]/button[text()="Following"]')), 5000);
    return true;
  } catch(e) {
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function clickLike(driver) {
  try {
    await driver.findElement(By.xpath('//section/span/button[span[@aria-label="좋아요"]] | //section/span/button[span[@aria-label="Like"]]')).click();
    await sleep(2);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath('//section/span/button[span[@aria-label="좋아요 취소"]] | //section/span/button[span[@aria-label="Unlike"]]')), 5000);
    return true;
  } catch(e) {
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function createAccount(driver, copy) {
    await driver.get('https://www.instagram.com/?hl=ko');

    const createId = `${randomChar()}${randomChar()}${copy.username.slice(2)}`;
    const createPassword = createRandomPassword();

    let id, password, fullname, username;
    let randomNumber = '';
    while(true) {
      await driver.findElement(By.xpath("//input[@name='emailOrPhone']")).clear();
      const randomEmail = `${createId}${randomNumber}@gmail.com`;
      await driver.findElement(By.xpath("//input[@name='emailOrPhone']")).sendKeys(randomEmail + Key.TAB);
      await sleep(1);
      await driver.wait(until.elementLocated(By.xpath("//label[input[@name='emailOrPhone']]/following-sibling::div/span")), 30000);
      const className = await driver.findElement(By.xpath("//label[input[@name='emailOrPhone']]/following-sibling::div/span")).getAttribute("class");
      if (className.includes('coreSpriteInputAccepted')) {
        id = randomEmail;
        break;
      }
      await sleep(1);
      randomNumber = Math.round(Math.random()*100);
    }

    fullname = createRandomName(createId);
    driver.findElement(By.xpath("//input[@name='fullName']")).sendKeys(fullname);

    randomNumber = '';
    while(true) {
      await driver.findElement(By.xpath("//input[@name='username']")).clear();
      const randomUsername = `${createId}${randomNumber}`;
      await driver.findElement(By.xpath("//input[@name='username']")).sendKeys(randomUsername + Key.TAB);
      await driver.findElement(By.xpath("//input[@name='emailOrPhone']")).click();
      await sleep(1);
      await driver.wait(until.elementLocated(By.xpath("//label[input[@name='username']]/following-sibling::div/span")), 30000);
      const className = await driver.findElement(By.xpath("//label[input[@name='username']]/following-sibling::div/span")).getAttribute("class")
      if (className.includes('coreSpriteInputAccepted')) {
        username = randomUsername;
        break;
      }
      await sleep(1);
      randomNumber = Math.round(Math.random()*1000);
    }

    while(true) {
      await driver.findElement(By.xpath("//input[@name='password']")).clear();
      let randomPassword = `${createPassword}`;
      await driver.findElement(By.xpath("//input[@name='password']")).sendKeys(randomPassword + Key.TAB);
      await driver.findElement(By.xpath("//input[@name='emailOrPhone']")).click();
      await sleep(1);
      await driver.wait(until.elementLocated(By.xpath("//label[input[@name='password']]/following-sibling::div/span")), 30000);
      const className = await driver.findElement(By.xpath("//label[input[@name='password']]/following-sibling::div/span")).getAttribute("class")
      if (className.includes('coreSpriteInputAccepted')) {
        password = randomPassword;
        break;
      }
      await sleep(1);
      randomPassword = createRandomPassword();
    }
    
    await driver.findElement(By.xpath("//button[@type='submit']")).click();

    try {
      await driver.wait(until.elementLocated(By.xpath("//p[@id=\"ssfErrorAlert\"][contains(text(), \"문제\")]")), 30000);
      await sleep(1);
      console.log(`새로운 아이피임에도 불구하고 가입 실패 ${await publicIP.v4()}`);
      return null;
    } catch(e) {
      return {
        id,
        password,
        fullname,
        username,
      }
    }
}

async function processTargetWork(store, http) {
  let targetWorks = await getInstagramTargetWork(store, http);
  let chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', {
    'args': [
      `--user-agent=${USER_AGENT}`,
      '--disable-gpu',
      '--disable-infobars',
      '--window-size=400,640',
    ]
  });
  const driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();

  for(let work of targetWorks) {
    await driver.get(work.url);
    const profile = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
    if (profile && profile.edge_owner_to_timeline_media.edges) {
      const medias = profile.edge_owner_to_timeline_media.edges;
      for (let media of medias) {
        if (new Date(new Date(work.regDate).getTime() - 3600*24*1000) < new Date(media.node.taken_at_timestamp*1000) && new Date(work.finishDate) > new Date(media.node.taken_at_timestamp*1000)) {
          await http.post(`api/instagram/work`, {
            url: `https://www.instagram.com/p/${media.node.shortcode}/`,
            type: (work.type === 'target_kgl') ? 'korea_ghost_like' : '',
            goal: work.goal,
          });
        }
      }
    }
  }
  try { await driver.quit(); } catch(e) { }
}


async function getInstagramTargetWork(store, http) {
  const response = await http.get('api/instagram/work/target');
  if (response.data) {
    return response.data;
  }
  return null;
}

function getInstagramWorkKG(store, http) {
  http.get('api/instagram/work/kg').then((response) => {
    if (response.data) {
      store.dispatch('setInstagramWorkKG', response.data);
    }
  });
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


function run(store, http, adb, process, option) {
  let driver;
  let isRepeat = true;
  let count = 0;
  setTimeout(async () => {
    try {
      let accounts = await getGhost(http, 0, 9999, 0);
      
      let beforeTime = 0;
      while (isRepeat) {
        if (option.workType === 'create') {
          let copyData = null;
          const tags = option.copyTag.split(',').map(item => item.trim());
          let account = null;

          let chromeCapabilities = Capabilities.chrome();
          chromeCapabilities.set('chromeOptions', {
            'args': [
              // '--headless',
              `--user-agent=${USER_AGENT}`,
              '--disable-gpu',
              '--disable-infobars',
              '--window-size=400,640',
            ]
          });
          driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
          // driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);

          // 카피 데이터 가져오기!
          while (isRepeat) {
            const copyList = accounts.map(item => item.copyNo);
            for(const tag of tags) {
              try {
                await driver.get(`https://www.instagram.com/explore/tags/${tag}/?hl=ko`);
                const data = await driver.executeScript('return _sharedData.entry_data.TagPage[0].graphql.hashtag');
                const medias = data.edge_hashtag_to_media.edges.filter(item => !copyList.includes(item.node.owner.id));
                if (medias.length > 0) {
                  try {
                    await driver.get(`https://www.instagram.com/p/${medias[0].node.shortcode}/`);
                    const post = await driver.executeScript('return _sharedData.entry_data.PostPage[0].graphql.shortcode_media');
                    await driver.get(`https://www.instagram.com/${post.owner.username}/`);
                    const profile = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
                    copyData = {
                      no: profile.id,
                      profile_pic_url: profile.profile_pic_url,
                      biography: profile.biography,
                      username: profile.username,
                      post: {
                        display_url: post.display_url,
                        caption: (post.edge_media_to_caption.edges[0]) ? post.edge_media_to_caption.edges[0].node.text : '',
                        shortcode: post.shortcode,
                      },
                    }
                  } catch (e) {
                    console.log('errorcode-1');
                    console.log(e);
                  }
                }
              } catch(e) {
                console.log('errorcode-2');
                console.log(e);
              }
            }
            if (copyData !== null) {
              break;
            }
          }
          await driver.quit();

          while (isRepeat) {
            try {
              await changeIpNoOverlap(adb, process, accounts);
              let chromeCapabilities = Capabilities.chrome();
              chromeCapabilities.set('chromeOptions', {
                'args': [
                  // '--headless',
                  `--user-agent=${USER_AGENT}`,
                  '--disable-gpu',
                  '--disable-infobars',
                  '--window-size=400,640',
                ]
              });
              driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
              // driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
              account = await createAccount(driver, copyData);
            } catch (e) {
              console.log('sibal'); 
              console.log(e);
            }
            if (account !== null) {
              
              break;
            }
            await driver.quit();
          }

          const newAccount = {
            email: account.id,
            password: account.password,
            username: account.username,
            fullname: account.fullname,
            img: copyData.profile_pic_url,
            biography: copyData.biography,
            regDate: new Date(),
            regIp: process.ip,
            cookie: JSON.stringify(await driver.manage().getCookies()),
            copyNumber: copyData.no,
            copyUsername: copyData.username,
            followCount: 0,
            likeCount: 0,
            active: true,
          };

          http.post('api/instagram/ghost', newAccount).then((response) => {
            if (response.data) {
              store.dispatch('addGhostAccounts', response.data);
            }
          });

          try {
            await driver.wait(until.elementLocated(By.xpath("//button[text()='나중에 하기']")), 30000);
            await sleep(1);
            await driver.findElement(By.xpath("//button[text()='나중에 하기']")).click();
          } catch(e) {
            try { await takeScreenshot(driver, 'error3'); } catch (e) { }
            console.log('errorcode-3');
            console.log(e);
          }
      
          try {
            const followButtons = await driver.findElements(By.xpath("//button[text()=\"팔로우\"]"));
            await sleep(1);
            // const random = Math.floor(Math.random()*10);
            // for (let i = 0; i < 5 + random; i++) {
            //   await followButtons[i].click();
            //   await sleep(0.5);
            // }
            await driver.findElement(By.xpath("//button[text()='시작하기']")).click();
          } catch(e) {
            try { await takeScreenshot(driver, 'error2'); } catch (e) { }
            console.log('errorcode-4');
            console.log(e);
          }

          try {
            await driver.wait(until.elementLocated(By.xpath("//span[@aria-label='프로필']")), 30000);
            await sleep(1);
            await driver.findElement(By.xpath("//span[@aria-label='프로필']")).click();
        
            await driver.wait(until.elementLocated(By.xpath("//button[text()='프로필 편집']")), 30000);
            await sleep(1);
            await driver.findElement(By.xpath("//button[text()='프로필 편집']")).click();
        
            await sleep(5);
            await driver.wait(until.elementLocated(By.xpath('//input[@type="file"]')), 30000);
            await sleep(1);
            await driver.findElement(By.xpath('//input[@type="file"]')).sendKeys(await readImageByUrl(copyData.profile_pic_url));
            
            await driver.wait(until.elementLocated(By.xpath("//textarea")), 30000);
            await sleep(1);

            if (copyData.biography !== '') {
              await driver.findElement(By.xpath("//textarea")).clear();
              // clipboardy.writeSync(copyData.biography);
              // await driver.findElement(By.xpath('//textarea')).sendKeys(Key.chord(Key.CONTROL, 'v'));
              await driver.findElement(By.xpath('//textarea')).sendKeys(copyData.biography);
              await sleep(1);
              while (true) {
                try {
                  await driver.findElement(By.xpath("//button[text()='제출']")).click();
                  await sleep(10);
                  break;
                } catch(e) {
                  console.log(e);
                  await sleep(1);
                }
              }
            }
          } catch(e) {
            console.log('errorcode-5');
            try { await takeScreenshot(driver, 'error5'); } catch (e) { }
          }
          await driver.quit();
        } else if (option.workType === 'work') {
          let date = new Date(new Date().setDate(new Date().getDate() - 3));
          accounts = accounts.filter(item => new Date(item.regDate) < date);
          while (isRepeat) {
            for (let i = 370; i < accounts.length; i += 1) {
              const account = accounts[i];
              try {
                let currentTime = new Date().getTime();
                if (currentTime - beforeTime >= 1800*1000) {
                  await processTargetWork(store, http);
                  getInstagramWorkKG(store, http);
                  beforeTime = currentTime;
                }

                if (!account.active) continue;
                if (!isRepeat) break; 
                const works = store.state.ghost.workKG.filter(item => !item.process || (item.process && !item.process.includes(account.id)));
                if (works.length < 1) continue;

                console.log(account.email);

                let chromeCapabilities = Capabilities.chrome();
                chromeCapabilities.set('chromeOptions', {
                  'args': [
                    // '--headless',
                    `--user-agent=${USER_AGENT}`,
                    '--disable-gpu',
                    '--disable-infobars',
                    '--window-size=400,640',
                  ]
                });
                driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
                await driver.get('https://www.instagram.com/?hl=ko');
                if (works && works.length > 0) {
                  await loadCookie(driver, JSON.parse(account.cookie));
                  if (await checkLogin(driver)) {
                    for (let work of works) {
                      try {
                        const { data } = await http.get(`api/instagram/work/finish/${work.id}`)
                        if (data) {
                          await driver.get(work.url);
                          const post = await driver.executeScript('return _sharedData.entry_data.PostPage[0].graphql.shortcode_media');
                          if (work.type.includes('follow')) {
                            if (post.owner.followed_by_viewer === false) {
                              if (await clickFollow(driver)) {
                                http.get(`api/instagram/work/process/${work.id}`, {
                                  params: {
                                    accountId: account.id,
                                  },
                                });
                              } else {
                                break;
                              }                     
                            }
                            store.dispatch('processingInstagramWorkKG', {
                              workId: work.id,
                              accountId: account.id,
                            });
                          } else if(work.type.includes('like')) {
                            if (post.viewer_has_liked === false) {
                              if (await clickLike(driver)) {
                                http.get(`api/instagram/work/process/${work.id}`, {
                                  params: {
                                    accountId: account.id,
                                  },
                                });
                              } else {
                                break;
                              }  
                            }
                            store.dispatch('processingInstagramWorkKG', {
                              workId: work.id,
                              accountId: account.id,
                            });
                          }
                        } else {
                          store.dispatch('removeInstagramWorkKG', {
                            id: work.id,
                          });
                        }
                      } catch(e) {
                        console.log('errorcode-8'); 
                        console.log(e); 
                      }
                      await sleep(5);
                    }
                  } else {
                    http.get(`api/instagram/ghost/${account.id}/active`, {
                      params: {
                        active: false,
                      },
                    }).then(() => {
                      account.active = false;
                    });
                  }
                }
                await driver.quit();
              } catch (e) {
                try { await driver.quit(); } catch(e) { }
                console.log('errorcode-7'); 
                console.log(e); 
              }
              await changeIp(adb, process, accounts);
            }
            await sleep(3600);
          }
        } else if (option.workType === 'alive') {
          console.log('alive start');
          let targetIndex = 0;

          if (option.targetEmail) {
            for (let i=0; i<accounts.length; i++) {
              if (!isRepeat) break;
              let account = accounts[i];
              if (account.email === option.targetEmail) {
                targetIndex = i;
                break;
              }
            }
          }

          for (let i=targetIndex; i<accounts.length; i++) {
            if (!isRepeat) break;
            let account = accounts[i];
            if (account.active === false) continue;
            
            let chromeCapabilities = Capabilities.chrome();
            chromeCapabilities.set('chromeOptions', {
              'args': [
                // '--headless',
                `--user-agent=${USER_AGENT}`,
                '--disable-gpu',
                '--disable-infobars',
                '--window-size=400,640',
              ]
            });
            const driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
            await driver.get('https://www.instagram.com/?hl=ko');
            await loadCookie(driver, JSON.parse(account.cookie));
            if (await checkLogin(driver)) {
              console.log(`[${account.regDate}] ${account.email} 생존 -------------------`);
            } else {
              console.log(`[${account.regDate}] ${account.email} 사망 @@@@@@@@@@@@@@@@@@@`);
              http.get(`api/instagram/ghost/${account.id}/active`, {
                params: {
                  active: false,
                },
              }).then(() => {
                account.active = false;
              });
            }
            try { await driver.quit(); } catch(e) { };
            await changeIp(adb, process);
          }
        }
      }
  
      console.log(account);
    } catch (e) {
      console.log('errorcode-6');
      try { await takeScreenshot(driver, 'error10'); } catch (e) { }
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
