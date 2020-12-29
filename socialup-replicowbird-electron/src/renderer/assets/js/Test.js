import fs from 'fs';
import { PassThrough } from 'stream';

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rsleep(startSec, endSec) {
  let ms = (Math.random()*(endSec-startSec) + startSec)*1000;
  console.log(`rsleep ${ms}`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getWeightRandom() {
  const random = Math.random()*9688;
  let number;
  if (random < 5000) {
    number = 180 + Math.floor(Math.random()*240);
  } else if (random < 7500) {
    number = 420 + Math.floor(Math.random()*600);
  } else if (random < 8750) {
    number = 1020 + Math.floor(Math.random()*840);
  } else if (random < 9375) {
    number = 1800 + Math.floor(Math.random()*2400);
  } else {
    number = 0;
  }
  console.log(number);
  return number;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


async function run(store, number) {

  for (let i=0; i < 100; i++) {
    getWeightRandom();
  }

  let dummyAction = [myFeedView, myDmView, viewStory, myProfileView, myProfileFollowerView, myProfileFollowingView, myActiveView, searchView, searchImageView, randomProfileView];
  // dummyAction = shuffle(dummyAction);

  for (let i=0; i < 100; i++) {
    dummyAction = shuffle(dummyAction);
    console.log(dummyAction[0].name);
  }

  // const opts2 = {
  //   platformName: "Android",
  //   platformVersion: "8.0.0",
  //   deviceName: "Galaxy S7 edge",
  //   appPackage: "com.instagram.android",
  //   appActivity: "com.instagram.mainactivity.MainActivity",
  //   fullReset: "false",
  //   noReset: "true",
  // };

  // const wd = require("wd");
  // let driver = null;

  // try { await driver.quit(); } catch (e) { };
  // driver = await wd.promiseChainRemote({
  //   host: '127.0.0.1',
  //   port: 4723, 
  // });
  // await driver.init(opts2);
  // await myFeedView(driver);
  // await myDmView(driver);
  // await viewStory(driver);
  // await myProfileView(driver);
  // await myProfileFollowerView(driver);
  // await myProfileFollowingView(driver);
  // await myActiveView(driver);
  // await searchView(driver);
  // await searchImageView(driver);
  // await randomProfileView(driver);
   
  // await gotoMain(driver);
  // console.log('close');
}

async function myFeedView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 피드보기 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[0].click();
    const random = Math.floor(5 + Math.random()*30);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "sticky_header_list");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 피드보기 에러: ${e.name}`);
  }
}

async function myDmView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 디엠보기 시작');
    const element = await driver.element("id", "action_bar_inbox_button");
    await element.click();
    const random = Math.floor(Math.random()*10);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "inbox_refreshable_thread_list_recyclerview");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
    const inboxs = await driver.elements("id", "row_inbox_container");
    const inbox = inboxs[Math.floor(Math.random()*inboxs.length)];
    inbox.click();

    const random2 = Math.floor(Math.random()*10);
    console.log(`랜덤카운트 : ${random2}`);
    for (let i=0; i<random2; i++) {
      const element = await driver.element("id", "message_list");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      console.log(`${i} - flick(0, ${random1 + random2}, ${random1 + random3});`)
      await element.flick(0, random1 + random2, random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 디엠보기 에러: ${e.name}`);
    console.log(e);
  }
}

async function viewStory(driver) {
  try {
    await gotoMain(driver);
    console.log('viewStory Start;')
    await sleep(2);
    const element = await driver.elements("id", "outer_container");
    await element[1].click();
    const random = Math.floor(40 + Math.random()*60);
    console.log(`randomCount: ${random}`);
    for (let i=0; i<random; i++) {
      const random1 = Math.floor(Math.random()*100);
      console.log(`pass number : ${random1}`);
      if (random1 < 50) {
        const element = await driver.element("id", "bottom_sheet_container");
        const random1 = Math.floor(200 + Math.random()*200);
        const random2 = Math.floor(Math.random()*150);
        const random3 = Math.floor(Math.random()*147);
        console.log(`${i} - flick(${-(random1 + random2)}, 0, ${random1 + random3});`)
        await element.flick(-(random1 + random2), 0, random1 + random3);
      }
      await rsleep(2, 10);
    }
    const back = await driver.element("id", "bottom_sheet_container");
    const random1 = Math.floor(800 + Math.random()*200);
    const random2 = Math.floor(Math.random()*150);
    const val = random1 + random2;
    await back.flick(0, val, Math.floor(val/10));
  } catch(e) {
    console.log(`나의 viewStory 에러: ${e.name}`);
    console.log(e);
  }
}

async function myProfileView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 피드보기 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[4].click();
    const random = Math.floor(1 + Math.random()*10);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "coordinator_root_layout");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 피드보기 에러: ${e.name}`);
  }
}

async function myProfileFollowerView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 myProfileFollowerView 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[4].click();
    await sleep(2);
    const element2 = await driver.element("id", "row_profile_header_followers_container");
    await element2.click();
    const random = Math.floor(1 + Math.random()*20);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "layout_listview_parent_container");
      const random1 = Math.floor(10 + Math.random()*2000);
      const random2 = Math.floor(Math.random()*169);
      const random3 = Math.floor(Math.random()*152);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${Math.floor((random1 + random3)/10)});`)
      await element.flick(0, -(random1 + random2), Math.floor((random1 + random3)/10));
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 myProfileFollowerView 에러: ${e.name}`);
    console.log(e);
  }
}

async function myProfileFollowingView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 myProfileFollowingView 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[4].click();
    await sleep(2);
    const element2 = await driver.element("id", "row_profile_header_following_container");
    await element2.click();
    const random = Math.floor(1 + Math.random()*20);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "layout_listview_parent_container");
      const random1 = Math.floor(10 + Math.random()*2000);
      const random2 = Math.floor(Math.random()*179);
      const random3 = Math.floor(Math.random()*163);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${Math.floor((random1 + random3)/10)});`)
      await element.flick(0, -(random1 + random2), Math.floor((random1 + random3)/10));
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 myProfileFollowingView 에러: ${e.name}`);
    console.log(e);
  }
}

async function myActiveView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 myActiveView 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[3].click();
    const random = Math.floor(5 + Math.random()*30);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "newsfeed_pager");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 myActiveView 에러: ${e.name}`);
    console.log(e);
  }
} 

async function searchView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 searchView 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[1].click();
    const random = Math.floor(10 + Math.random()*60);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "recycler_view");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await rsleep(0, 4);
    }
  } catch(e) {
    console.log(`나의 searchView 에러: ${e.name}`);
  }
}

async function searchImageView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 searchImageView 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[1].click();

    await sleep(2);

    const imageElements = await driver.elements("id", "image_button");
    console.log(imageElements);
    const key = Math.floor(Math.random()*imageElements.length);
    console.log(key);
    await imageElements[key].click();

    const random = Math.floor(10 + Math.random()*60);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "sticky_header_list");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*151);
      const random3 = Math.floor(Math.random()*148);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await rsleep(0, 2);
    }
  } catch(e) {
    console.log(`나의 searchImageView 에러: ${e.name}`);
    console.log(e);
  }
}

async function randomProfileView(driver) {
  try {
    await gotoMain(driver);
    console.log('나의 randomProfileView 시작');
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[1].click();

    await rsleep(2, 3);

    const imageElements = await driver.elements("id", "image_button");
    console.log(imageElements);
    const key = Math.floor(Math.random()*imageElements.length);
    console.log(key);
    await imageElements[key].click();

    await rsleep(0, 1);

    const profileName = await driver.elements("id", "row_feed_photo_profile_name");
    await profileName[0].click();

    const random = Math.floor(1 + Math.random()*10);
    console.log(`랜덤카운트 : ${random}`);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "coordinator_root_layout");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*155);
      const random3 = Math.floor(Math.random()*152);
      console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 randomProfileView 에러: ${e.name}`);
    console.log(e);
  }
}

async function gotoMain(driver) {
  while(true) {
    try {
      let backButton1 = await driver.elements("id", "action_bar_button_back");
      let backButton2 = await driver.elements("id", "action_bar_cancel");
      let backButton3 = await driver.elements("id", "close_button");
      if (backButton1[0]) {
        await backButton1[0].click();
      } else if(backButton2[0]) {
        await backButton2[0].click();
      } else if(backButton3[0]) {
        await backButton3[0].click();
      } else {
        const element = await driver.elements("id", "tab_icon");
        if (element.length > 3) {
          console.log('is main');
          break;
        }
      }
    } catch(e) { break; }
  }
}

export default run;