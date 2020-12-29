const appium = require("appium");
const wd = require("wd");

const opts2 = {
  platformName: "Android",
  // platformVersion: "6.0.1",
  // deviceName: "SM-G906L",
  platformVersion: "8.0.0",
  deviceName: "Galaxy S7 edge",
  appPackage: "com.instagram.android",
  appActivity: "com.instagram.mainactivity.MainActivity",
  fullReset: "false",
  noReset: "true",
  // automationName: "UiAutomator2"
};

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {

  const appiumServer = await appium.main({
    port: 4723,
  });

  const driver = await wd.promiseChainRemote({
    host: '127.0.0.1',
    port: 4723,
  });

  await driver.init(opts2);
  await driver.setImplicitWaitTimeout(5000);

  // const client = await wdio.remote(opts);
  // await client.lock();
  // console.log(await client.isLocked());
  // await client.unlock();
  // console.log(await client.isLocked());
  // let activity = await client.getCurrentActivity();
  // console.log(activity);
  
  // console.log('closeApp');
  // await client.closeApp();
  // console.log('launchApp');
  // await client.launchApp();

  let elementTwo = await driver.elements("id", "tab_icon");
  await elementTwo[1].click();
  let searchEditText = await driver.element("id", "action_bar_search_edit_text");
  await searchEditText.click();
  await searchEditText.type('맛집');
  await driver.hideDeviceKeyboard();

  let searchHashs = await driver.elements("id", "row_hashtag_textview_tag_name");
  console.log(`searchHashs.length : ${searchHashs.length}`);
  let searchTag = null;
  for (let searchHash of searchHashs) {
    let name = await searchHash.text();
    console.log(name);
    if (name === '#맛집') {
      searchTag = searchHash;
      break;
    }
  }

  if (searchTag) {
    await searchTag.click();
  } else {
    console.log('태그없음 통과');
  }

  await sleep(3);
  let tabButtons = await driver.elements("class name", "android.widget.TextView");
  console.log(`tabButtons.length : ${tabButtons.length}`);
  let recentButton = null;

  for (let tabButton of tabButtons) {
    let name = await tabButton.text();
    console.log(name);
    if (name === '최근 게시물') {
      recentButton = tabButton;
      break;
    }
  }

  if (recentButton) {
    await recentButton.click();
  } else {
    console.log('최신게시물 버튼없음 통과');
  }

  let imageViews = await driver.elements("class name", "android.widget.ImageView");
  console.log(`tabButtons.length : ${imageViews.length}`);
  await imageViews[0].click();

  for (let i = 0; i < 2; i++) {
    let followButtons = await driver.elements("id", "button");
    let likeButtons = await driver.elements("id", "row_feed_button_like");
    let commentButtons = await driver.elements("id", "row_feed_button_comment");

    if (followButtons[0] && likeButtons[0]) {
      const followY = (await followButtons[0].getLocation()).y;
      const likeY = (await likeButtons[0].getLocation()).y
      if (followY < likeY) {
        console.log('좋아요 해도된다!');
        if (commentButtons[0]) {
          await commentButtons[0].click();
          let commentEditText = await driver.element("id", "layout_comment_thread_edittext");
          await commentEditText.click();
          await commentEditText.type('선팔하구가요 ');

          const emojis = await driver.elements("id", "item_emoji");
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          await emoji.click();

          const summitButton = await driver.element("id", "layout_comment_thread_post_button");
          await summitButton.click();
          await sleep(3);

          const backButton = await driver.element("id", "action_bar_button_back");
          await backButton.click();
          followButtons = await driver.elements("id", "button");
          likeButtons = await driver.elements("id", "row_feed_button_like");
        }
        await likeButtons[0].click();
        await followButtons[0].click();
      } else {
        console.log('꼬임 통과');
      }
    }
    
    try {
      let action = new wd.TouchAction(driver);
      action.press({x: 200, y: Math.random() * 500 + 1200})
            .moveTo({x: 200, y: Math.random() * 200 + 50})
            .release();
      await action.perform();
    } catch(e) {
      console.log(e);
    }
  }

  // let action = new wd.TouchAction(driver);
  // action.press({x: 200, y: 1000})
  //       .moveTo({x: 200, y: 200})
  //       .release();
  // await action.perform();

  // let element = await driver.element("id", "layout_container_main");
  // await element.flick(100, 100, 1000);

  // await driver.execute('mobile: scroll', {direction: 'down'});


  // for (let imageView of imageViews) {
  //   let name = await imageView.getTagName();
  //   console.log(name);
  // }

  // if (recentButton) {
  //   await recentButton.click();
  // } else {
  //   console.log('최신게시물 버튼없음 통과');
  // }

  // await client.elementClick("2131301087");
  // let elementTwo = await client.$("~2131301087");
  // console.log(elementTwo);
  

  

  // const buttons = await client.$$("~tab_icon");
  // console.log(buttons);

  // const field = await client.$("~TextField1");
  // await field.setValue("Hello World!");
  // const value = await field.getValue();
  // assert.equal(value,"Hello World!");

  await client.deleteSession();
  await appiumServer.close();
})();