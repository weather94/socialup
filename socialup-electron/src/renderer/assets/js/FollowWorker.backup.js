/* eslint-disable */
import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import FollowLog from './FollowLog';
import WorkLog from './WorkLog';
import InstagramWorkWorker from './InstagramWorkWorker';
//import { Builder, By, Key, until } from 'selenium-webdriver';

const CHECK_TIME = 60*5*1000;
//60*5*1000
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

function sleep(store, sec, id) {
  let ms = sec*1000 + Math.random()*1000;
  store.dispatch('addWorkLog', new WorkLog(45, 'success', id, 'fw_wait', `wait ${Math.floor(ms)} mills`));
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rsleep(store, startSec, endSec, id) {
  let ms = (Math.random()*(endSec-startSec) + startSec)*1000;
  store.dispatch('addWorkLog', new WorkLog(45, 'success', id, 'fw_wait', `wait ${Math.floor(ms)} mills`));
  return new Promise(resolve => setTimeout(resolve, ms));
}

function msleep(store, sec, id) {
  let ms = sec + Math.random()*100;
  store.dispatch('addWorkLog', new WorkLog(45, 'success', id, 'fw_wait', `wait ${Math.floor(ms)} mills`));
  return new Promise(resolve => setTimeout(resolve, sec));
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

function getDateToContent(data) {
  let text = (data.edge_media_to_caption && data.edge_media_to_caption.edges[0]) ? data.edge_media_to_caption.edges[0].node.text : '';
  const ownerId = data.owner.id;
  if (data.edge_media_to_parent_comment && data.edge_media_to_parent_comment.edges && data.edge_media_to_parent_comment.edges.length > 0) {
    data.edge_media_to_parent_comment.edges.forEach(item => {
      if (item && item.node && item.node.owner && item.node.owner.id === ownerId) {
        text = text + item.node.text;
      }
    });
  }

  if (data.edge_media_to_comment && data.edge_media_to_comment.edges && data.edge_media_to_comment.edges.length > 0) {
    data.edge_media_to_comment.edges.forEach(item => {
      if (item && item.node && item.node.owner && item.node.owner.id === ownerId) {
        text = text + item.node.text;
      }
    });
  }

  return text;
}

function getComment(store, setting, data, id) {
  const text = getDateToContent(data);

  if (setting.commentType === 0) {
    return getAutoComment(store, text, setting.autoComments, id);
  } else if (setting.commentType === 1) {
    return getCommentForRule(store, text, data.accessibility_caption, setting.commentRules, id);
  } else if (setting.commentType === 2) {
    let result = getCommentForRule(store, text, data.accessibility_caption, setting.commentRules, id);
    if (result) {
      return result;
    }
    return getAutoComment(store, text, setting.autoComments, id);
  } else {
    return null;
  }
}

function getAutoComment(store, caption, autoComment, id) {
  for (let ac of autoComment) {
    if (caption.includes(ac.keyword)) {
      let randomIndex = Math.floor(ac.comments.length * Math.random());
      store.dispatch('addWorkLog', new WorkLog(32, 'success', id, 'fw_getAutoComment', `MATCH: ${ac.keyword} / RANDOM: ${randomIndex} / COMMENT: ${ac.comments[randomIndex]}`));
      return ac.comments[randomIndex];
    }
  }

  let defaultComment = autoComment.filter(item => item.keyword === '!default')[0];
  if (defaultComment) {
    let randomIndex = Math.floor(defaultComment.comments.length * Math.random());
    store.dispatch('addWorkLog', new WorkLog(33, 'success', id, 'fw_getAutoComment', `!default RANDOM: ${randomIndex} / COMMENT: ${defaultComment.comments[randomIndex]}`));
    return defaultComment.comments[randomIndex];
  }
  return null;
}

function getCommentForRule(store, caption, image_caption, rules, id) {
  for (const rule of rules) {
    if (rule.useImageTag) {
      if (image_caption) {
        const result = rule.imageTags.reduce((acc, value) => {
          return acc && image_caption.includes(value);
        }, true);
        if (!result) {
          continue;
        }
      } else {
        continue;
      }
    }

    if (rule.includeTags.length <= 0) {
      continue;
    }

    const includeResult = rule.includeTags.reduce((acc, value) => {
      return acc && caption.includes(value);
    }, true);

    if (!includeResult) {
      continue;
    }

    const excludeResult = rule.excludeTags.reduce((acc, value) => {
      return acc && !caption.includes(value);
    }, true);

    if (!excludeResult) {
      continue;
    }
    const randomIndex = Math.floor(rule.comments.length * Math.random());
    store.dispatch('addWorkLog', new WorkLog(124, 'success', id, 'fw_comment_rule', `MATCH: ${rule.name} / RANDOM: ${randomIndex} / COMMENT: ${rule.comments[randomIndex]}`));
    return rule.comments[randomIndex];
  }

  return null;
}

async function spamCheck(store, setting, data, id) {
  try {
    if (data.accessibility_caption && data.accessibility_caption.includes('텍스트')) {
      await store.dispatch('addWorkLog', new WorkLog(14, 'success', id, 'fw_spamcheck', `spam imageType TEXT detected`));
      return false;
    }

    const content = getDateToContent(data);
    for (let tag of store.state.flag.defaultSpamTag) {
      if (content.includes(tag)) {
        await store.dispatch('addWorkLog', new WorkLog(14, 'success', id, 'fw_spamcheck', `default_spam_check '${tag}' detected`));
        return false;
      }
    }
    for (let tag of setting.blackTags) {
      if (content.includes(tag)) {
        await store.dispatch('addWorkLog', new WorkLog(14, 'success', id, 'fw_spamcheck', `spam '${tag}' detected`));
        return false;
      }
    }
    return true;
  } catch(e) {
    await store.dispatch('addWorkLog', new WorkLog(12, 'success', id, 'fw_spamcheck_notag', e));
    return false;
  }
}

async function checkLogin(store, driver, id) {
  await driver.get('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher');
  const currentUrl = await driver.getCurrentUrl();
  if("https://www.instagram.com/?hl=ko" === currentUrl || "https://www.instagram.com/" === currentUrl){
    return true;
  } else {
    await store.dispatch('addWorkLog', new WorkLog(2, 'error', id, 'fw', 'check_login'));
    return false;
  }
}

async function loadCookie(store, driver, cookies, id) {
  try {
    if (cookies) {
      for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
      }
      await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'fw', 'load_cookie'));
    }
  } catch (e) { console.log(e); }
}

async function saveCookie(store, driver, id) {
  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl !== 'https://www.instagram.com/?hl=ko') {
    driver.get('https://www.instagram.com/?hl=ko');
  }
  await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
  let username = await driver.findElement(By.xpath('//a[span[@aria-label="프로필"]]')).getAttribute("href");
  username = username.replace('https://www.instagram.com/', '').replace('/', '');
  store.dispatch('setAccount', {
    id,
    username,
    cookie: await driver.manage().getCookies(),
  });
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'fw', 'save_cookie'));
}

async function checkToken(store, http, key, id) {
  try {
    await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'fw_checkToken', 'start'));
    const response = await http.get('api/instagram/check', { params: { key, }, });
    if (response.data) {
      await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'fw_checkToken', 'end_success'));
      return false;
    }
  } catch(e) {
    await store.dispatch('addWorkLog', new WorkLog(5, 'error', id, 'fw_checkToken', e));
  }
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'fw_checkToken', 'end_failure'));
  return true;
}

async function alertAndClose(store, driver, message, id) {
  driver.quit();
  store.dispatch('setMultiProcess', {
    id,
    process: false,
  });
  await store.dispatch('addWorkLog', new WorkLog(5, 'success', id, 'fw', 'alert_close'));
  // if (message) {
  //   alert(message, '소셜업');
  // }
}

function checkActiveTime(store, times, id) {
  if (times.includes(new Date().getHours())) {
    return true;
  }
  store.dispatch('addWorkLog', new WorkLog(6, 'success', id, 'fw_check_active_time', 'no activce time.'));
  return false;
}

function checkProccesingCountPerTag(store, count, setting, id) {
  if (count >= setting.processingCountPerTag) {
    store.dispatch('addWorkLog', new WorkLog(10, 'success', id, 'fw_check_proccesing_count_per_tag', `processing per hashtag ${setting.processingCountPerTag} success`));
    return false;
  }
  return true;
}

function checkProcessingProbability(store, setting, id) {
  const random = Math.random()*100;
  if (setting.processingProbability < random) {
    store.dispatch('addWorkLog', new WorkLog(16, 'success', id, 'fw_check_processing_probability', `probability ${100-setting.processingProbability}% pass ${Math.floor(random)}`));
    return false;
  }
  return true;
}

function checkFollowLimit(store, setting, id){
  if (store.state.instagram.logs[id] && store.state.instagram.logs[id][store.state.instagram.todayKey] && store.state.instagram.logs[id][store.state.instagram.todayKey].follow >= setting.followLimitPerDay) {
    store.dispatch('addWorkLog', new WorkLog(17, 'success', id, 'fw_click_follow', `over follow limit ${setting.followLimitPerDay}`));
    return false;
  }
  return true;
}

function checkLikeLimit(store, setting, id){
  if (store.state.instagram.logs[id] && store.state.instagram.logs[id][store.state.instagram.todayKey] && store.state.instagram.logs[id][store.state.instagram.todayKey].likeCount >= setting.likeLimitPerDay) {
    store.dispatch('addWorkLog', new WorkLog(20, 'success', id, 'fw_click_like', `over like limit ${setting.likeLimitPerDay}`));
    return false;
  }
  return true;
}

function checkCommentLimit(store, setting, id){
  if (store.state.instagram.logs[id] && store.state.instagram.logs[id][store.state.instagram.todayKey] && store.state.instagram.logs[id][store.state.instagram.todayKey].comment >= setting.commentLimitPerDay) {
    store.dispatch('addWorkLog', new WorkLog(23, 'success', id, 'fw_submit_comment', `over comment limit ${setting.commentLimitPerDay}`));
    return false;
  }
  return true;
}

function checkUnfollowLimit(store, setting, id){
  if (store.state.instagram.logs[id] && store.state.instagram.logs[id][store.state.instagram.todayKey] && store.state.instagram.logs[id][store.state.instagram.todayKey].unfollow >= setting.followLimitPerDay) {
    store.dispatch('addWorkLog', new WorkLog(17, 'success', id, 'fw_unfollow', `over unfollow limit ${setting.followLimitPerDay}회`));
    return false;
  }
  return true;
}

async function clickFollow2(driver) {
  try {
    await driver.findElement(By.xpath('//div[@class="bY2yH"]/button[text()="팔로우"] | //div[@class="bY2yH"]/button[text()="Follow"]')).click();
    await driver.wait(until.elementLocated(By.xpath('//div[@class="bY2yH"]/button[text()="팔로잉"] | //div[@class="bY2yH"]/button[text()="Following"]')), 5000);
  } catch(e) { }
  return true;
}

async function clickLike2(driver) {
  try {
    await driver.findElement(By.xpath('//section/span/button[span[@aria-label="좋아요"]] | //section/span/button[span[@aria-label="Like"]]')).click();
    await driver.wait(until.elementLocated(By.xpath('//section/span/button[span[@aria-label="좋아요 취소"]] | //section/span/button[span[@aria-label="Unlike"]]')), 5000);
  } catch(e) { }
  return true;
}

async function submitComment2(driver, comment, username) {
  try {
    await driver.findElement(By.xpath('//button[span[@aria-label="댓글 달기"]]')).click();
    await sleep(1);
    await driver.findElement(By.xpath('//textarea[@aria-label="댓글 달기..."]')).sendKeys(comment);
    await sleep(1);
    // await driver.findElement(By.xpath('//button[text()="게시"]')).click();
    await driver.findElement(By.xpath('//form[textarea[@aria-label="댓글 달기..."]]')).submit();
    await sleep(1);
    await driver.wait(until.elementLocated(By.xpath(`//a[@title="${username}"]`)), 15000);
  } catch(e) { console.log(e); }
  return true;
}

async function followLikeComment(driver, command, setting, account, hashtag, data) {
  const isFollow = command.includes('f');
  const isLike = command.includes('l');
  const isComment = command.includes('c');

  const flag = (setting.mutualFollowingTimeout > 0) ? true : false;

  const user = data.owner.username;
  const postUrl = data.shortcode;

  let comment;

  await sleep(1);
  if (isFollow) {
    await clickFollow2(driver);
    await rsleep(2, 4);
  }

  if (isLike) {
    await clickLike2(driver);
    await rsleep(2, 4);
  }

  if (isComment) {
    comment = getComment(setting, data);
    await submitComment2(driver, comment, account.username);
    await rsleep(2, 4);
  }
  
  await driver.navigate().refresh();

  try {
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로")] | //button[contains(text(), "Follow")]')), 1000);
  } catch (e) {
    if (isFollow) {
      store.dispatch('addInstagramLog', new FollowLog(1, false, '팔로우', hashtag, user, postUrl, account.id));
      store.dispatch('addWorkLog', new WorkLog(18, 'success', account.id, 'fw_click_follow', `following ${user}`))
    }
    if (isLike) {
      store.dispatch('addInstagramLog', new FollowLog(2, false, '좋아요', '', user, postUrl, account.id));
      store.dispatch('addWorkLog', new WorkLog(21, 'success', account.id, 'fw_click_like', `like ${user}`));
    }
    if (isComment) {
      store.dispatch('addInstagramLog', new FollowLog(3, false, '댓글', comment, user, postUrl, account.id));
      store.dispatch('addWorkLog', new WorkLog(24, 'success', account.id, 'fw_submit_comment', `comment ${comment} user ${user} ${postUrl}`));
    }
    return;
  }

  if (isFollow) {
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="bY2yH"]/button[text()="팔로잉"] | //div[@class="bY2yH"]/button[text()="Following"]')), 1000);
      store.dispatch('addInstagramLog', new FollowLog(1, false, '팔로우', hashtag, user, postUrl, account.id));
    } catch (e) {
      store.dispatch('addInstagramLog', new FollowLog(1, true, '팔로우', hashtag, user, postUrl, account.id));
      await sleep(60);
    }
  }

  if (isLike) {
    try {
      await driver.wait(until.elementLocated(By.xpath('//section/span/button[span[@aria-label="좋아요 취소"]] | //section/span/button[span[@aria-label="Unlike"]]')), 1000);
      store.dispatch('addInstagramLog', new FollowLog(2, false, '좋아요', '', user, postUrl, account.id));
    } catch (e) {
      store.dispatch('addInstagramLog', new FollowLog(2, true, '좋아요', '', user, postUrl, account.id));
      await sleep(60);
    }
  }

  if (isComment) {
    try {
      await driver.wait(until.elementLocated(By.xpath(`//a[@title="${option.username}"]`)), 1000);
      store.dispatch('addInstagramLog', new FollowLog(3, false, '댓글', comment, user, postUrl, account.id));
    } catch (e) {
      console.log(e);
      console.log(`${option.email} 코멘트 누락`);
      store.dispatch('addInstagramLog', new FollowLog(3, true, '댓글', comment, user, postUrl, account.id));
      await sleep(60);
    }
  }
  return;
}

async function clickFollow(store, driver, user, postUrl, hashtag, id) {
  try {
    await driver.findElement(By.xpath('//div[@class="bY2yH"]/button[text()="팔로우"] | //div[@class="bY2yH"]/button[text()="Follow"]')).click();
    await driver.wait(until.elementLocated(By.xpath('//div[@class="bY2yH"]/button[text()="팔로잉"] | //div[@class="bY2yH"]/button[text()="Following"]')), 5000);
    store.dispatch('addInstagramLog', new FollowLog(1, false, '팔로우', hashtag, user, postUrl, id));
    store.dispatch('addWorkLog', new WorkLog(18, 'success', id, 'fw_click_follow', `following ${user}`));
    return true;
  } catch(e) {
    store.dispatch('addWorkLog', new WorkLog(19, 'error', id, 'fw_click_follow', e));
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function clickLike(store, driver, user, postUrl, id) {
  try {
    await driver.findElement(By.xpath('//section/span/button[span[@aria-label="좋아요"]] | //section/span/button[span[@aria-label="Like"]]')).click();
    await driver.wait(until.elementLocated(By.xpath('//section/span/button[span[@aria-label="좋아요 취소"]] | //section/span/button[span[@aria-label="Unlike"]]')), 5000);
    store.dispatch('addInstagramLog', new FollowLog(2, false, '좋아요', '', user, postUrl, id));
    store.dispatch('addWorkLog', new WorkLog(21, 'success', id, 'fw_click_like', `like ${user}`));
    return true;
  } catch(e) {
    //await takeScreenshot(driver, e.name);
    store.dispatch('addWorkLog', new WorkLog(22, 'error', id, 'fw_click_like', e));
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function submitComment(store, driver, user, postUrl, comment, username, id) {
  try {
    await driver.findElement(By.xpath('//button[span[@aria-label="댓글 달기"]]')).click();
    await driver.findElement(By.xpath('//textarea[@aria-label="댓글 달기..."]')).sendKeys(comment);
    await driver.findElement(By.xpath('//form[textarea[@aria-label="댓글 달기..."]]')).submit();
    try {
      await driver.wait(until.elementLocated(By.xpath(`//a[@title="${username}"]`)), 10000);
    } catch (e) {
      await driver.navigate().refresh();
      await driver.wait(until.elementLocated(By.xpath(`//a[@title="${username}"]`)), 10000);
    }
    await store.dispatch('addInstagramLog',  new FollowLog(3, false, '댓글', comment, user, postUrl, id));
    await store.dispatch('addWorkLog', new WorkLog(24, 'success', id, 'fw_submit_comment', `comment ${comment} user ${user} ${postUrl}`));
    return true;
  } catch(e) {
    console.log(e);
    await store.dispatch('addWorkLog', new WorkLog(25, 'error', id, 'fw_submit_comment', e));
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function clickUnfollow(store, driver, user, log, id) {
  try {
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로")] | //button[contains(text(), "Follow")]')), 5000);
    await driver.findElement(By.xpath('//button[text()="팔로잉"] | //button[text()="Following"]')).click();
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로우 취소")] | //button[contains(text(), "Unfollow")]')), 5000);
    await driver.findElement(By.xpath('//button[contains(text(), "팔로우 취소")] | //button[contains(text(), "Unfollow")]')).click();
    await driver.wait(until.elementLocated(By.xpath('//button[text()="팔로우"] | //button[text()="Follow"]')), 5000);
    await driver.navigate().refresh();
    const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
    if (data.followed_by_viewer === false) {
      await store.dispatch('addInstagramLog',  new FollowLog(4, false, '언팔로우', log, user, '', id));
      await store.dispatch('removeFriend', {
        id,
        name: user,
      });
      await store.dispatch('addWorkLog', new WorkLog(27, 'success', id, 'fw_unfollow', `${user} ${log})`));
      return true;
    } else {
      await store.dispatch('addWorkLog', new WorkLog(456, 'error', id, 'fw_unfollow', `${user} unfollow_omitted_refresh_check`));
      return 'block';
    }
  } catch (e) {
    console.log(e);
    await store.dispatch('addWorkLog', new WorkLog(28, 'error', id, 'fw_unfollow', e));
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function checkFollowback(store, driver, setting, id) {
  if(setting.mutualFollowingTimeout > 0) {
    store.dispatch('addWorkLog', new WorkLog(26, 'success', id, 'fw', 'mutual_unfollow'));
    let standard = new Date();
    standard.setDate(standard.getDate() - setting.mutualFollowingTimeout);
    if (store.state.instagram.logs[id]) {
      const dates = Object.keys(store.state.instagram.logs[id]).filter(item => new Date(item) <= standard).reverse();
      for(const backKey of dates) {
        if (store.state.instagram.logs[id][backKey] && store.state.instagram.logs[id][backKey].details) {
          if (store.state.instagram.logs[id][backKey].unfollowProcess < store.state.instagram.logs[id][backKey].follow) {
            const followings = store.state.instagram.logs[id][backKey].details.filter(item => item.type === 1);
            let index = (store.state.instagram.logs[id][backKey].unfollowProcess) ? store.state.instagram.logs[id][backKey].unfollowProcess : 0;
            if (followings && followings[index] && followings[index].user) {
              await driver.get(`https://www.instagram.com/${followings[index].user}/?hl=ko`);
              try {
                await driver.wait(until.elementLocated(By.xpath('(//button[contains(text(), "팔로")]) | (//button[contains(text(), "Follow")])')), 5000);
                const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
                if (data.follows_viewer === false && data.followed_by_viewer) {
                  let result = await clickUnfollow(store, driver, followings[index].user, `${setting.mutualFollowingTimeout}일간 맞팔X (${backKey})`, id);
                  if (result === 'block') {
                    break;
                  }
                  store.dispatch('unfollowTrue', {
                    id,
                    backKey,
                    following: followings[index],
                  });
                } else if (data.follows_viewer === true) {
                  store.dispatch('addFollowBack', {
                    id,
                    key: backKey,
                  });
                  store.dispatch('followBackTrue', {
                    id,
                    backKey,
                    following: followings[index],
                  });
                }
              } catch (e) {
                await store.dispatch('addWorkLog', new WorkLog(7, 'error', id, 'fw_mutual_unfollow_profile', e));
                console.log(e);
                if (e.name === 'NoSuchSessionError') {
                  throw {name: 'NoSuchSessionError'};
                }
              }
              store.dispatch('setUnfollowProcess', {
                id,
                key: backKey,
                value: ++index,
              });
            }
            break;
          } else if(store.state.instagram.logs[id][backKey].details) {
            store.dispatch('clearInstagramLogDetails', {
              id,
              backKey,
            });
          }
        }
      }
    }
  }
}

async function GetFollowers(store, driver, id) {
  await driver.get('https://www.instagram.com/accounts/access_tool/accounts_following_you?hl=ko');
  try {
    while(true) {
      await driver.wait(until.elementLocated(By.xpath('//button[text()="더 보기"][not(@disabled)]')), 10000);
      await driver.findElement(By.xpath('//button[text()="더 보기"][not(@disabled)]')).click();
      await msleep(store, 200, id);
    }
  } catch(e) {
    await store.dispatch('addWorkLog', new WorkLog(81, 'error', id, 'gfollowers', e));
  }
  const followers = await driver.executeScript('return [...document.querySelectorAll("section > div")].map(item => item.innerText);');
  return followers;
}

async function GetFollowing(store, driver, id) {
  await driver.get('https://www.instagram.com/accounts/access_tool/accounts_you_follow?hl=ko');
  try {
    while(true) {
      await driver.wait(until.elementLocated(By.xpath('//button[text()="더 보기"][not(@disabled)]')), 10000);
      await driver.findElement(By.xpath('//button[text()="더 보기"][not(@disabled)]')).click();
      await msleep(store, 200, id);
    }
  } catch(e) {
      console.log(e);
      await store.dispatch('addWorkLog', new WorkLog(81, 'error', id, 'gfollowing', e));
  }
  const following = await driver.executeScript('return [...document.querySelectorAll("section > div")].map(item => item.innerText);');
  return following;
}

async function checkFriends(store, driver, id) {
  let standard = new Date();
  standard.setDate(standard.getDate() - 3);
  if (!store.state.instagram.friends[id] || standard > new Date(store.state.instagram.friends[id].date)) {
    store.dispatch('setTitle', `[${id}] 친구목록을 불러오는 중 입니다`);
    const followers = await GetFollowers(store, driver, id);
    const following = await GetFollowing(store, driver, id);
    store.dispatch('setFriends', {
      id,
      followers,
      following,
    });
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getInstagramWork(store, http, account) {
  http.get('api/instagram/work/kr').then((response) => {
    if (response.data) {
      store.dispatch('saveInstagramWork', {
        id: account.id,
        works: response.data,
      });
    }
  });
}

function saveWorkLog(store, http, account) {
  const date = new Date().toLocaleDateString();
  // const beforeDate = new Date(new Date().setDate(new Date().getDate() - setting.mutualFollowingTimeout));
  if (store.state.instagram.logs[account.id] && store.state.instagram.logs[account.id][date]) {
    http.post('/api/instagram/log/work', {
      email: account.id,
      date,
      comment: store.state.instagram.logs[account.id][date].comment,
      follow: store.state.instagram.logs[account.id][date].follow,
      likeCount: store.state.instagram.logs[account.id][date].likeCount,
      unfollow: store.state.instagram.logs[account.id][date].unfollow,
      unfollowProcess: store.state.instagram.logs[account.id][date].unfollowProcess,
      followback: store.state.instagram.logs[account.id][date].followback,
      followOmit: store.state.instagram.logs[account.id][date].followOmit,
      likeOmit: store.state.instagram.logs[account.id][date].likeOmit,
      commentOmit: store.state.instagram.logs[account.id][date].commentOmit,
      unfollowOmit: store.state.instagram.logs[account.id][date].unfollowOmit,
    });
  }
}

function checkOmit(store, account) {
  if (store.state.instagram.logs[account.id][date].followOmit > 10
    || store.state.instagram.logs[account.id][date].likeOmit > 1
    || store.state.instagram.logs[account.id][date].commentOmit > 20) {
      await store.dispatch('addWorkLog', new WorkLog(110, 'error', account.id, 'check_omit', '인스타그램 기능정지'));
    return true;
  } else {
    return false;
  }
}

function run(store, http, process, account, setting) {
  let isRepeat = true;
  let driver;
  let startTime = new Date().getTime();
  setTimeout(async () => {
    store.dispatch('setTitle', `[${account.id}] 작업을 시작합니다 ㅡ ${setting.name}`);
    await store.dispatch('addWorkLog', new WorkLog(1, 'success', account.id, 'fw', 'START'));
    const chromeCapabilities = Capabilities.chrome();
    const args = ['--disable-infobars', '--lang=ko_KR',  `--user-agent=${USER_AGENT}`];
    if (!process.viewBrowser) { args.push('--headless'); }
    if (process.proxy) { args.push(`--proxy-server=http://${process.proxyAddress}`); }
    chromeCapabilities.set('chromeOptions', { args, });
    driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    
    await driver.get('https://www.instagram.com/?hl=ko');
    await loadCookie(store, driver, account.cookie, account.id);

    // 로그인성공 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    if (await checkLogin(store, driver, account.id)) {
      await saveCookie(store, driver, account.id);

      let beforeTime = 0;
      while(isRepeat) {
        store.dispatch('setTitle', `${account.username} 작업이 진행중입니다 ㅡ ${setting.name}`);
        // try {
          if (checkActiveTime(store, setting.activeTimes, account.id)) {
            if (checkOmit(store, account)) {
              await sleep(60);
              continue;
            }

            if (new Date().getTime() - beforeTime >= CHECK_TIME) {
              saveWorkLog(store, http, account, setting);
              if (await checkToken(store, http, process.token, account.id)) {
                alertAndClose(store, driver, '중복 로그인 입니다.', account.id);
                break;
              }
              beforeTime = new Date().getTime();
            }

            if (setting.followType === 1) {
              if(setting.targetTags.length < 1) {
                store.dispatch('setTitle', `[${account.username}] 타겟태그가 없습니다.`);
                break;
              }
              for (let hashtag of setting.targetTags) {
                if (!isRepeat) {
                  break;
                }
                // 활동시간 체크 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                if (checkActiveTime(store, setting.activeTimes, account.id)) {
                  if (checkFollowLimit(store, setting, account.id) || checkLikeLimit(store, setting, account.id)) {
                    try {
                      await driver.get(`https://www.instagram.com/explore/tags/${hashtag}/?hl=ko`);
                      await driver.wait(until.elementLocated(By.xpath('//h2[text()="최근 사진"]/following-sibling::div//a[contains(@href, "/p/")]')), 5000);
                    } catch(e) {
                      e.tag = hashtag;
                      await store.dispatch('addWorkLog', new WorkLog(11, 'error', account.id, 'enter_tag', e));
                      continue;
                    }
    
                    const data = await driver.executeScript('return _sharedData.entry_data.TagPage[0].graphql.hashtag');
                    const links = data.edge_hashtag_to_media.edges.map(item => item.node.shortcode);
    
                    let count = 0;
                    for (let link of shuffle(links)) {
                      if (!isRepeat) break;
                      if (checkOmit(store, account)) break;
                      
                      if (new Date().getTime() - beforeTime > CHECK_TIME) {
                        saveWorkLog(store, http, account, setting);
                        getInstagramWork(store, http, account);
                        if (await checkToken(store, http, process.token, account.id)) {
                          store.dispatch('setTitle', `[${account.username}] 중복로그인으로 작업을 종료합니다`);
                          alertAndClose(store, driver, '중복 로그인 입니다.', account.id);
                          break;
                        }
                        beforeTime = new Date().getTime();
                      }
    
                      if (checkActiveTime(store, setting.activeTimes, account.id) && checkProccesingCountPerTag(store, count, setting, account.id)) {
                        if (!isRepeat) break;
                        if(new Date().getTime - startTime >= 60*20*1000) {
                          await InstagramWorkWorker(process.viewBrowser, store, driver, http, account, setting);
                        }
                        await driver.get(`https://www.instagram.com/p/${link}/?hl=ko`);
                        try {
                          await driver.wait(until.elementLocated(By.xpath('(//div[@class="bY2yH"]/button[contains(text(), "팔로")]) | (//div[@class="bY2yH"]/button[contains(text(), "Follow")])')), 5000);
                          await store.dispatch('addWorkLog', new WorkLog(11, 'success', account.id, 'enter_post', `url: ${link}`));
                        } catch(e) {
                          e.url = link;
                          await store.dispatch('addWorkLog', new WorkLog(11, 'error', account.id, 'enter_post', e));
                          continue;
                        }
    
                        const data = await driver.executeScript('return _sharedData.entry_data.PostPage[0].graphql.shortcode_media');
                        const user = data.owner.username;
                        const postUrl = data.shortcode;
                        
                        if (checkProcessingProbability(store, setting, account.id) && await spamCheck(store, setting, data, account.id)) {
                          if (data.owner.followed_by_viewer === false && data.viewer_has_liked === false && data.comments_disabled === false) {
                            let result = false;
                            
                            if (checkFollowLimit(store, setting, account.id)) {
                              if (await clickFollow(store, driver, user, postUrl, hashtag, account.id)) {
                                result = true;
                              }
                            }
                            if (checkLikeLimit(store, setting, account.id)) {
                              if (await clickLike(store, driver, user, postUrl, account.id)) {
                                result = true;
                              }
                            }
                            if (checkCommentLimit(store, setting, account.id) && result) {
                              const comment = getComment(store, setting, data, account.id);
                              if (comment) {
                                await submitComment(store, driver, user, postUrl, comment, account.username, account.id);
                              }
                            }
                            if (checkUnfollowLimit(store, setting, account.id)) {
                              await checkFollowback(store, driver, setting, account.id);
                            }
                            count++;
                            workCount++;
                            await sleep(store, setting.processingInterval, account.id);
                          }
                        }
                      } else {
                        break;
                      }
                    }
                  } else {
                    if (checkUnfollowLimit(store, setting, account.id)) {
                      await checkFollowback(store, driver, setting, account.id);
                    } else {
                      store.dispatch('setTitle', `[${account.username}] 하루 작업량을 완료하여 대기중입니다`);
                    }
                    await sleep(store, setting.processingInterval, account.id);
                  }
                } else {
                  store.dispatch('setTitle', ` [${account.username}] 작업활성화 시간이 아니므로 대기중입니다`);
                  await sleep(store, 60, account.id);
                  break;
                }
              }
            } else if (setting.followType === 2) {
              await checkFriends(store, driver, account.id);

              let followers = store.state.instagram.friends[account.id].friends;
              if (setting.followerOrder === 1) {
                followers = work.friends.value.filter(item => item.follower === true && item.following === true);
              } else if (setting.followerOrder === 2) {
                followers = work.friends.value.filter(item => item.follower === true);
              } else if (setting.followerOrder === 3) {
                followers = work.friends.value.filter(item => item.following === true);
              } else if (setting.followerOrder === 4) {
                followers = work.friends.value.filter(item => item.follower === true && item.following === false);
              } else if (setting.followerOrder === 5) {
                followers = work.friends.value.filter(item => item.follower === false && item.following === true);
              }
              followers = shuffle(followers);
              for (const follower of followers) {
                if (!isRepeat) {
                  break;
                }

                if (new Date().getTime() - beforeTime >= CHECK_TIME) {
                  saveWorkLog(store, http, account, setting);
                  getInstagramWork(store, http, account);
                  if (await checkToken(store, http, process.token, account.id)) {
                    store.dispatch('setTitle', `[${account.username}] 중복로그인으로 작업을 종료합니다`);
                    alertAndClose(store, driver, '중복 로그인 입니다.', account.id);
                    break;
                  }
                  beforeTime = new Date().getTime();
                }
                if (checkActiveTime(store, setting.activeTimes, account.id)) {
                  if (checkLikeLimit(store, setting, account.id)) {
                    try {
                      await driver.get(`https://www.instagram.com/${follower.name}/?hl=ko`);
                      const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
                      if (data.followed_by_viewer === true && data.edge_owner_to_timeline_media.edges.length > 0) {
                        let index = 1;

                        for (const edge of data.edge_owner_to_timeline_media.edges) {
                          if (index > setting.likePerFollower && index > setting.commentPerFollower) {
                            break;
                          }
                          await driver.get(`https://www.instagram.com/p/${edge.node.shortcode}/?hl=ko`);
                          const post = await driver.executeScript('return _sharedData.entry_data.PostPage[0].graphql.shortcode_media');
                          const user = post.owner.username;
                          const postUrl = post.shortcode;

                          if (index <= setting.likePerFollower && post.viewer_has_liked === false && checkLikeLimit(store, setting, account.id)) {
                            if (await clickLike(store, driver, user, postUrl, account.id)) {
                              if (index <= setting.commentPerFollower && post.comments_disabled === false && checkCommentLimit(store, setting, account.id)) {
                                const comment = getComment(store, setting, post, account.id);
                                if (comment) {
                                  await submitComment(store, driver, user, postUrl, comment, account.username, account.id);
                                }
                              }
                            }
                            await sleep(store, 1, account.id);
                          }
                          index++;
                        }
                        await sleep(store, setting.processingInterval, account.id);
                      }
                    } catch (e) {
                      console.log(e);
                      await store.dispatch('addWorkLog', new WorkLog(342, 'error', account.id, 'w_my_f_m', 'no_page(id not exist)'));
                    }
                  } else {
                    store.dispatch('setTitle', `[${account.username}] 하루 작업량을 완료하여 대기중입니다`);
                    await sleep(store, 60, account.id);
                  }
                } else {
                  store.dispatch('setTitle', `[${account.username}] 작업활성화 시간이 아니므로 대기중입니다`);
                  await sleep(store, 60, account.id);
                  break;
                }
              }
            } else if (setting.followType === 3) {
              await checkFriends(store, driver, account.id);
              let followers;
              let tag;
              if (setting.unfollowType === 1) {
                followers = store.state.instagram.friends[account.id].friends.filter(item => item.following === true && item.follower === false);
                tag = '맞팔제외언팔';
              } else if (setting.ufollowType === 2) {
                followers = store.state.instagram.friends[account.id].friends.filter(item => item.following === true);
                tag = '모두언팔';
              }

              followers = followers.filter(item => !setting.targetUsers.includes(item)).reverse();
              if (followers.length <= 0) {
                store.dispatch('setTitle', `[${account.username}] 언팔할 유저가 없어 작업을 종료합니다`);
                break;
              }
              let index = 1;
              for (const follower of followers) {
                if (!isRepeat) {
                  break;
                }
                
                if (new Date().getTime() - beforeTime > CHECK_TIME) {
                  saveWorkLog(store, http, account, setting);
                  if (await checkToken(store, http, process.token, account.id)) {
                    store.dispatch('setTitle', `[${account.username}] 중복로그인으로 작업을 종료합니다`);
                    alertAndClose(store, driver, '중복 로그인 입니다.', account.id);
                    break;
                  }
                  beforeTime = new Date().getTime();
                }

                if (checkActiveTime(store, setting.activeTimes, account.id)) {
                  if (checkUnfollowLimit(store, setting, account.id)) {
                    try {
                      await driver.get(`https://www.instagram.com/${follower.name}/?hl=ko`);
                      const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
                      if (data.followed_by_viewer) {
                        const result = await clickUnfollow(store, driver, follower.name, `${tag} (${index++}/${followers.length})`, account.id);
                        if (result === true) {
                          await sleep(store, setting.processingInterval, account.id);
                        }
                      } else {
                        await store.dispatch('addWorkLog', new WorkLog(2, 'success', account.id, 'w_uf', 'w_already_remove_friend'));
                        await store.dispatch('removeFriend', {
                          id: account.id,
                          name: follower.name,
                        });
                      }
                    } catch (e) {
                      console.log(e);
                      await store.dispatch('addWorkLog', new WorkLog(2, 'error', account.id, 'w_uf', 'no_page(id not exist)'));
                    }
                  } else {
                    store.dispatch('setTitle', `[${account.username}] 하루 작업량을 완료하여 대기중입니다`);
                    await sleep(store, 60, account.id);
                  }
                } else {
                  store.dispatch('setTitle', `[${account.username}] 작업활성화 시간이 아니므로 대기중입니다`);
                  await sleep(store, 60, account.id);
                }
              }
            }
          } else {
            store.dispatch('setTitle', ` [${account.username}] 작업활성화 시간이 아니므로 대기중입니다`);
            await sleep(store, 60, account.id);
          }
          // 서버체크 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // } catch(e) {
        //   console.log(e);
        //   await store.dispatch('addWorkLog', new WorkLog(2, 'error', account.id, 'fw_while', e));
        //   if (e.name === 'NoSuchSessionError') {
        //     store.dispatch('setTitle', `[${account.username}] 작업을 종료되었습니다.`);
        //     break;
        //   }
        // }
      }
    // 로그인실패 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    } else {
      store.dispatch('setTitle', `[${account.username}] 인스타그램 로그인실패로 작업을 종료합니다`);
      alertAndClose(store, driver, '인스타그램 로그인에 실패하였습니다.\n왼쪽메뉴 마이페이지에서 인스타그램 계정을 등록해주세요.', account);
    }

    // 에러떠서 종료될 경우
    if(isRepeat) {
      store.dispatch('setMultiProcess', {
        id: account.id,
        process: false,
      });
      http.get('api/instagram/token/return', { params: { key: process.token } }).then(() => {
        store.dispatch('setMultiToken', {
          id: account.id,
          token: null,
        });
      });
      store.dispatch('addWorkLog', new WorkLog(31, 'success', account.id, 'fw_thread_close', 'for error'));
      await driver.quit();
    }
  }, 1);

  return () => {
    if (driver) {
      isRepeat = false;
      driver.close();
      driver.quit();
      store.dispatch('setMultiProcess', {
        id: account.id,
        process: false,
      });
      store.dispatch('addWorkLog', new WorkLog(31, 'success', account.id, 'fw_click_close', 'end'));
      return true;
    }
    return false;
  };
}

export default run;