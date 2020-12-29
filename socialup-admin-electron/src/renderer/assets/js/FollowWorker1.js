/* eslint-disable */
import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import LogDetail from './LogDetail';
import WorkLog from './WorkLog';
import InstagramWorkWorker from './InstagramWorkWorker';
import IdPwLogin from './IdPwLogin';

const CHECK_TIME = 60*10*1000;
//60*5*1000
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
const DEFAULT_SPAM = [
  '토토사이트', '온라인카지노', '안전공원', '카지노사이트', '해외 안전', '메이저공원', '네임드', '도박', '바둑이', '픽스터', '단폴배팅', '무료픽',
  '파워볼', '사설토토', '바카라', '토토분석', '라이브스코어', '안전놀이터', '바카라사이트', '안전사이트', '온라인바카라',
  '최신게시물', '인기게시물', '도배상품', '국내당일배송', '최저마진', '비즈슈머', '마이셀즈', '애드펌킨',
  '쇼핑몰창업', '주부부업', '직장인투잡', '아지트샵', '인기게시물 상품', '팔로워 증가상품', '좋아요 증가상품',
  '클럽페이스', '아레나', '옥타곤', '메이드', '버닝썬', '매스', '클럽유레카', '마진거래', 'FX', '호빠', '호스트빠', '호스트바',
  '출장안마', '출장마사지', '출장아가씨', '콜걸', '원나잇', '룸싸롱', '성인놀이터', '신음소리', '상담환영',
  '유흥업소알바', '유흥주점알바', '단란주점알바', '노래방알바', '룸싸롱알바', '유흥알바', '룸알바', '강남쩜오', '소액', '대출', '롤링',
  '가슴성형', '강남일수', '강남고수익알바', '고수익알바', '지방이식', '눈성형', '텐카페', '자동차딜러',
  '룸싸롱', '룸살롱', '풀싸롱', '텐프로', '쩜오', '하드코어', '란제리룸', '조건만남', '섹스타그램', '오프녀', '섹스', '좆', '보지',
];

function sleep(sec) {
  let ms = sec*1000 + Math.random()*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rsleep(startSec, endSec) {
  let ms = (Math.random()*(endSec-startSec) + startSec)*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

function msleep(sec) {
  let ms = sec + Math.random()*100;
  return new Promise(resolve => setTimeout(resolve, sec));
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

function getDataToContent(data) {
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

function getComment(setting, data) {
  const text = getDataToContent(data);

  if (setting.commentType === 0) {
    return getAutoComment(text, setting.autoComments);
  } else if (setting.commentType === 1) {
    return getCommentForRule(text, data.accessibility_caption, setting.commentRules);
  } else if (setting.commentType === 2) {
    let result = getCommentForRule(text, data.accessibility_caption, setting.commentRules);
    if (result) {
      return result;
    }
    return getAutoComment(text, setting.autoComments);
  } else {
    return null;
  }
}

function getAutoComment(caption, autoComment) {
  for (let ac of autoComment) {
    if (caption.includes(ac.keyword)) {
      let randomIndex = Math.floor(ac.comments.length * Math.random());
      return ac.comments[randomIndex];
    }
  }

  let defaultComment = autoComment.filter(item => item.keyword === '!default')[0];
  if (defaultComment) {
    let randomIndex = Math.floor(defaultComment.comments.length * Math.random());
    return defaultComment.comments[randomIndex];
  }
  return null;
}

function getCommentForRule(caption, image_caption, rules) {
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
    return rule.comments[randomIndex];
  }

  return null;
}

function spamCheck(setting, data) {
  try {
    if (data.accessibility_caption && data.accessibility_caption.includes('텍스트')) {
      return false;
    }

    const content = getDataToContent(data);
    for (let tag of DEFAULT_SPAM) {
      if (content.includes(tag)) {
        return false;
      }
    }
    for (let tag of setting.blackTags) {
      if (content.includes(tag)) {
        return false;
      }
    }
    return true;
  } catch(e) {
    return false;
  }
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

async function loadCookie(driver, cookies) {
  try {
    if (cookies) {
      const _cookies = JSON.parse(cookies);
      console.log(_cookies);
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

async function saveCookieAndUsername(driver, http, option) {
  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl !== 'https://www.instagram.com/?hl=ko') {
    driver.get('https://www.instagram.com/?hl=ko');
  }
  await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
  let username = await driver.findElement(By.xpath('//a[span[@aria-label="프로필"]]')).getAttribute("href");
  username = username.replace('https://www.instagram.com/', '').replace('/', '');

  const cookie = JSON.stringify({
    cookie: await driver.manage().getCookies(),
    sessionStorage: await driver.executeScript('return Object.keys(sessionStorage).map(item => ({ key: item, value: sessionStorage[item]}));'),
    localStorage: await driver.executeScript('return Object.keys(localStorage).map(item => ({ key: item, value: localStorage[item]}));'),
  });

  option.username = username;

  http.put(`api/instagram/proxy/${option.id}/cookie-and-username`, {
    cookie,
    username,
  });
}

function toLocaleDateString(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate(); 
  return `${date.getYear() + 1900}-${(month < 10) ? '0' + month : month}-${(day < 10) ? '0' + day : day}`;
}

function toLocaleTimeString(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds(); 
  return `${(hour < 10) ? '0' + hour : hour}:${(minute < 10) ? '0' + minute : minute}:${(second < 10) ? '0' + second : second}`;
}

function checkActiveTime(times) {
  if (times.includes(new Date().getHours())) {
    return true;
  }
  return false;
}

function checkProccesingCountPerTag(count, setting) {
  if (count >= setting.processingCountPerTag) {
    return false;
  }
  return true;
}

function checkWorkLog(worklog) {
  const date = new Date().toLocaleDateString();
  if(worklog.date !== date) {
    worklog.follow = 0;
    worklog.likeCount = 0;
    worklog.comment = 0;
    worklog.unfollow = 0;
    worklog.followOmit = 0;
    worklog.likeOmit = 0;
    worklog.commentOmit = 0;
    worklog.unfollowOmit = 0;
    worklog.date = date;
  }
}

function checkProcessingProbability(setting) {
  const random = Math.random()*100;
  if (setting.processingProbability < random) {
    return false;
  }
  return true;
}

function checkFollowLimit(worklog, setting){
  checkWorkLog(worklog);
  if (worklog.follow >= setting.followLimitPerDay) {
    return false;
  }
  return true;
}

function checkLikeLimit(worklog, setting){
  checkWorkLog(worklog);
  if (worklog.likeCount >= setting.likeLimitPerDay) {
    return false;
  }
  return true;
}

function checkCommentLimit(worklog, setting){
  checkWorkLog(worklog);
  if (worklog.comment >= setting.commentLimitPerDay) {
    return false;
  }
  return true;
}

function checkUnfollowLimit(worklog, setting){
  checkWorkLog(worklog);
  if (worklog.unfollow >= setting.followLimitPerDay) {
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

async function followLikeComment(driver, http, command, setting, option, work, worklog, hashtag, data) {
  const isFollow = command.includes('f');
  const isLike = command.includes('l');
  const isComment = command.includes('c');

  const flag = (setting.mutualFollowingTimeout > 0) ? true : false;

  const user = data.owner.username;
  const postUrl = data.shortcode;

  let comment;

  let followDate;
  let likeDate;
  let commentDate;

  await sleep(1);
  if (isFollow) {
    await clickFollow2(driver);
    followDate = new Date();
    await rsleep(2, 4);
  }

  if (isLike) {
    await clickLike2(driver);
    likeDate = new Date();
    await rsleep(2, 4);
  }

  if (isComment) {
    comment = getComment(setting, data);
    await submitComment2(driver, comment, option.username);
    commentDate = new Date();
    await rsleep(2, 4);
  }
  
  await driver.navigate().refresh();

  try {
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로")] | //button[contains(text(), "Follow")]')), 1000);
  } catch (e) {
    if (isFollow) {
      work.logs.push(new LogDetail(1, false, option.email, toLocaleDateString(followDate), null, toLocaleTimeString(followDate), user, hashtag, flag));
      worklog.follow++;
    }
  
    if (isLike) {
      work.logs.push(new LogDetail(2, false, option.email, toLocaleDateString(likeDate), null, toLocaleTimeString(likeDate), postUrl, null));
      worklog.likeCount++;
    }
  
    if (isComment) {
      work.logs.push(new LogDetail(3, false, option.email, toLocaleDateString(commentDate), null, toLocaleTimeString(commentDate), postUrl, comment));
      worklog.comment++;
    }
    return false;
  }

  if (isFollow) {
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="bY2yH"]/button[text()="팔로잉"] | //div[@class="bY2yH"]/button[text()="Following"]')), 1000);
      work.logs.push(new LogDetail(1, false, option.email, toLocaleDateString(followDate), null, toLocaleTimeString(followDate), user, hashtag, flag));
      worklog.follow++;
    } catch (e) {
      work.logs.push(new LogDetail(1, true, option.email, toLocaleDateString(followDate), null, toLocaleTimeString(followDate), user, hashtag, flag));
      worklog.follow++;
      worklog.followOmit++;
      logMessage(http, work, option, `팔로우가 누락되었습니다. ${10 + worklog.followOmit*5}분간 작업중지`);
      // await sleep(600 + worklog.followOmit * 300);
      await sleep(10);
      return true;
    }
  }

  if (isLike) {
    try {
      await driver.wait(until.elementLocated(By.xpath('//section/span/button[span[@aria-label="좋아요 취소"]] | //section/span/button[span[@aria-label="Unlike"]]')), 1000);
      work.logs.push(new LogDetail(2, false, option.email, toLocaleDateString(likeDate), null, toLocaleTimeString(likeDate), postUrl, null));
      worklog.likeCount++;
    } catch (e) {
      work.logs.push(new LogDetail(2, true, option.email, toLocaleDateString(likeDate), null, toLocaleTimeString(likeDate), postUrl, null));
      worklog.likeCount++;
      worklog.likeOmit++;
      logMessage(http, work, option, `좋아요가 누락되었습니다. ${10 + worklog.followOmit*5}분간 작업중지`);
      // await sleep(600 + worklog.followOmit * 300);
      await sleep(10);
      return true;
    }
  }

  if (isComment) {
    try {
      await driver.wait(until.elementLocated(By.xpath(`//a[@title="${option.username}"]`)), 1000);
      work.logs.push(new LogDetail(3, false, option.email, toLocaleDateString(commentDate), null, toLocaleTimeString(commentDate), postUrl, comment));
      worklog.comment++;
    } catch (e) {
      console.log(e);
      console.log(`${option.email} 코멘트 누락`);
      work.logs.push(new LogDetail(3, true, option.email, toLocaleDateString(commentDate), null, toLocaleTimeString(commentDate), postUrl, comment));
      worklog.comment++;
      worklog.commentOmit++;
      logMessage(http, work, option, `코멘트가 누락되었습니다. 120초간 작업중지`);
      // await sleep(120);
      await sleep(10);
      return false;
    }
  }
  return false;
}

async function clickFollow(driver) {
  try {
    await driver.findElement(By.xpath('//div[@class="bY2yH"]/button[text()="팔로우"] | //div[@class="bY2yH"]/button[text()="Follow"]')).click();
    await driver.wait(until.elementLocated(By.xpath('//div[@class="bY2yH"]/button[text()="팔로잉"] | //div[@class="bY2yH"]/button[text()="Following"]')), 5000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로")] | //button[contains(text(), "Follow")]')), 1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="bY2yH"]/button[text()="팔로잉"] | //div[@class="bY2yH"]/button[text()="Following"]')), 5000);
    } catch (e) {
      return 'omit';
    }
    return true;
  } catch(e) {
    console.log('팔로우 클릭에러');
    console.log(e)
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function clickLike(driver) {
  try {
    await driver.findElement(By.xpath('//section/span/button[span[@aria-label="좋아요"]] | //section/span/button[span[@aria-label="Like"]]')).click();
    await driver.wait(until.elementLocated(By.xpath('//section/span/button[span[@aria-label="좋아요 취소"]] | //section/span/button[span[@aria-label="Unlike"]]')), 5000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로")] | //button[contains(text(), "Follow")]')), 1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//section/span/button[span[@aria-label="좋아요 취소"]] | //section/span/button[span[@aria-label="Unlike"]]')), 5000);
    } catch (e) {
      return 'omit';
    }
    return true;
  } catch(e) {
    console.log('좋아요 클릭에러');
    console.log(e);
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function submitComment(driver, comment, username) {
  try {
    await driver.findElement(By.xpath('//button[span[@aria-label="댓글 달기"]]')).click();
    await sleep(1);
    await driver.findElement(By.xpath('//textarea[@aria-label="댓글 달기..."]')).sendKeys(comment);
    await sleep(1);
    await driver.findElement(By.xpath('//form[textarea[@aria-label="댓글 달기..."]]')).submit();
    await sleep(1);
    await driver.wait(until.elementLocated(By.xpath(`//a[@title="${username}"]`)), 15000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로")] | //button[contains(text(), "Follow")]')), 1000);
    try {
      await driver.wait(until.elementLocated(By.xpath(`//a[@title="${username}"]`)), 5000);
    } catch (e) {
      return 'omit';
    }
    return true;
  } catch(e) {
    console.log(e);
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function clickUnfollow(driver) {
  try {
    await driver.wait(until.elementLocated(By.xpath('//button[div/span[@aria-label="팔로잉"]]')), 5000);
    await driver.findElement(By.xpath('//button[div/span[@aria-label="팔로잉"]]')).click();
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "팔로우 취소")] | //button[contains(text(), "Unfollow")]')), 5000);
    await driver.findElement(By.xpath('//button[contains(text(), "팔로우 취소")] | //button[contains(text(), "Unfollow")]')).click();
    await driver.wait(until.elementLocated(By.xpath('//button[text()="팔로우"] | //button[text()="Follow"]')), 5000);
    await driver.navigate().refresh();
    const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
    if (data.followed_by_viewer === false) {
      return true;
    } else {
      return 'omit';
    }
  } catch (e) {
    console.log(e);
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function checkFollowback(driver, http, worklog, email, work) {
  if (work.unfollowUser && work.unfollowUser.length > 0) {
    const currentDate = new Date();
    await driver.get(`https://www.instagram.com/${work.unfollowUser[0].username}/?hl=ko`);
    try {
      await driver.wait(until.elementLocated(By.xpath('//header//img')), 10000);
      const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
      if (data.followed_by_viewer === true) {
        if (data.follows_viewer === false) {
          const unfollowResult = await clickUnfollow(driver);
          if (unfollowResult === true) {
            worklog.unfollow++;
            work.logs.push(new LogDetail(4, false, email, toLocaleDateString(currentDate), work.unfollowUser[0].date, toLocaleTimeString(currentDate), work.unfollowUser[0].username, null, true));
            work.unfollowUser = work.unfollowUser.slice(1);
          } else if (unfollowResult === 'omit') {
            work.logs.push(new LogDetail(4, true, email, toLocaleDateString(currentDate), work.unfollowUser[0].date, toLocaleTimeString(currentDate), work.unfollowUser[0].username, null, true));
            worklog.unfollow++;
            worklog.unfollowOmit++;
          }
        } else if (data.follows_viewer === true) {
          work.logs.push(new LogDetail(5, false, email, work.unfollowUser[0].date, null, toLocaleTimeString(currentDate), work.unfollowUser[0].username, null));
          work.unfollowUser = work.unfollowUser.slice(1);
        }
      } else {
        http.delete(`api/instagram/proxy/follow/${work.unfollowUser[0].id}`);
        work.unfollowUser = work.unfollowUser.slice(1);
      }
    } catch (e) {
      console.log(e);
      if (e.name === 'NoSuchSessionError') {
        throw {name: 'NoSuchSessionError'};
      }
      http.delete(`api/instagram/proxy/follow/${work.unfollowUser[0].id}`);
      work.unfollowUser = work.unfollowUser.slice(1);
    }
  }
}

async function GetFollowers(driver) {
  await driver.get('https://www.instagram.com/accounts/access_tool/accounts_following_you?hl=ko');
  try {
    while(true) {
      await driver.wait(until.elementLocated(By.xpath('//button[text()="더 보기"][not(@disabled)]')), 10000);
      await driver.findElement(By.xpath('//button[text()="더 보기"][not(@disabled)]')).click();
      await msleep(200);
    }
  } catch(e) {
    console.log(e);
  }
  const followers = await driver.executeScript('return [...document.querySelectorAll("section > div")].map(item => item.innerText);');
  return followers;
}

async function GetFollowing(driver) {
  await driver.get('https://www.instagram.com/accounts/access_tool/accounts_you_follow?hl=ko');
  try {
    while(true) {
      await driver.wait(until.elementLocated(By.xpath('//button[text()="더 보기"][not(@disabled)]')), 10000);
      await driver.findElement(By.xpath('//button[text()="더 보기"][not(@disabled)]')).click();
      await msleep( 200);
    }
  } catch(e) {
      console.log(e);
  }
  const following = await driver.executeScript('return [...document.querySelectorAll("section > div")].map(item => item.innerText);');
  return following;
}

async function GetFriends(driver) {
  const friends = [];
  const followers = await GetFollowers(driver);
  console.log(followers);
  const following = await GetFollowing(driver);
  console.log(following);
  for (let item of followers) {
    friends.push({ name: item, follower: true, following: false });
  }

  for (let item of following) {
    const friend = friends.filter(friend => friend.name === item)[0];
    if (friend) {
      friend.following = true;
    } else {
      friends.push({ name: item, follower: false, following: true });
    }
  }
  return friends;
}

async function checkFriends(driver, work, http, email) {
  if (work.friends.value.length > 0) {
    let standard = new Date();
    standard.setDate(standard.getDate() - 1);
    if (!work.friends.date || work.friends.date < standard) {
      const currentDate = new Date();
      work.logs.push(new LogDetail(10, false, email, currentDate.toLocaleDateString(), null, currentDate.toLocaleTimeString(), '친구목록', '불러오는 중입니다.'));
      saveLogDetail(http, work);
      work.friends.value = await GetFriends(driver);
      work.friends.date = currentDate;
    }
  } else {
    const currentDate = new Date();
    work.logs.push(new LogDetail(10, false, email, currentDate.toLocaleDateString(), null, currentDate.toLocaleTimeString(), '친구목록', '불러오는 중입니다.'));
    saveLogDetail(http, work);
    work.friends.value = await GetFriends(driver);
    work.friends.date = currentDate;
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function saveLogDetail(http, work) {
  if (work.logs.length > 0) {
    http.post('api/instagram/proxy/log-details', work.logs);
    work.logs = [];
  }
};

async function getInstagramWork(http, instagramWork) {
  const response = await http.get('api/instagram/work/kr');
  if (response.data) {
    let newInstagramWork;
    if (!instagramWork || instagramWork.length < 1) {
      newInstagramWork = response.data;
    } else {
      const newInstagramWork = [];
      response.data.forEach((item) => {
        const result = instagramWork.filter(work => item.id === work.id)[0];
        if (result) {
          newInstagramWork.push(result);
        } else {
          newInstagramWork.push(item);
        }
      });
    }
    return newInstagramWork;
  } else {
    return [];
  }
}

async function getUnfollowUser(http, setting, email) {
  if (setting.mutualFollowingTimeout > 0) {
    let standard = new Date();
    standard.setDate(standard.getDate() - setting.mutualFollowingTimeout);
    const response = await http.get('api/instagram/proxy/follow', {
      params: {
        email,
        date: toLocaleDateString(standard),
      },
    });
    if (response.data) {
      return response.data;
    } else {
      return [];
    }
  } else {
    return [];
  }
}

async function saveAccountLogAndProfile(http, driver, option) {
  await driver.get(`https://www.instagram.com/${option.username}/?hl=ko`);
  await driver.wait(until.elementLocated(By.xpath(`//h1[contains(text(), "${option.username}")]`)), 10000);
  const profile = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
  http.post('api/instagram/log/account', {
    email: option.email,
    date: new Date().toLocaleDateString(),
    board: profile.edge_owner_to_timeline_media.count,
    follower: profile.edge_followed_by.count,
    following: profile.edge_follow.count,
  });
  const retProfile = {};
  retProfile.username = profile.username;
  retProfile.biography = profile.biography;
  retProfile.full_name = profile.full_name;
  retProfile.profile_pic_url = profile.profile_pic_url;
  if (profile.edge_owner_to_timeline_media && profile.edge_owner_to_timeline_media.edges) {
    retProfile.timeline = {
      count: profile.edge_owner_to_timeline_media.count,
      edges: profile.edge_owner_to_timeline_media.edges.map((edge) => {
        return {
          accessibility_caption: edge.node.accessibility_caption,
          like: edge.node.edge_liked_by.count,
          comment: edge.node.edge_media_to_comment.count,
          thumbnail: edge.node.thumbnail_src,
          shortcode: edge.node.shortcode,
        }
      }),
    }
    retProfile.sum = retProfile.timeline.edges.reduce((acc, cur) => ({
      like: acc.like + cur.like,
      comment: acc.comment + cur.comment,
    }), { like: 0, comment: 0 });

    const tag = profile.edge_owner_to_timeline_media.edges.reduce((acc, cur) => {
      if (cur.node.edge_media_to_caption.edges[0] && cur.node.edge_media_to_caption.edges[0].node.text) {
        const words = cur.node.edge_media_to_caption.edges[0].node.text.split('#');
        words.forEach((item, index) => {
          const word = item.split(' ')[0];
          if (word !== '' && index !== 0) {
            if (acc[word]) {
              acc[word] += 1;
            } else {
              acc[word] = 1;
            }
          }
        });
      }
      return acc;
    }, {});

    const tags = Object.keys(tag).map(item => ({
      tag: item,
      count: tag[item],
    })).sort((a, b) => b.count - a.count);

    retProfile.tag_rank = tags;
  }
  const profileString = JSON.stringify(retProfile);
  if (option.profile !== profileString) {
    http.put(`api/instagram/proxy/${option.id}/profile`, {
      email: option.email,
      profile: profileString,
    });
  }
}

function checkOmit(devOption, worklog) {
  checkWorkLog(worklog);
  if (worklog.followOmit > devOption.followOmit || worklog.likeOmit > devOption.likeOmit || worklog.commentOmit > devOption.commentOmit) {
    return true;
  } else {
    return false;
  }
}

function logMessage(http, work, option, text) {
  if (text !== work.beforeText) {
    const currentDate = new Date(); 
    work.logs.push(new LogDetail(20, false, option.email, currentDate.toLocaleDateString(), null, currentDate.toLocaleTimeString(), null, text));
    work.beforeText = text;
    saveLogDetail(http, work);
  }
}

function run(http, option, worklog, devOption) {
  let isRepeat = true;
  let driver;
  let setting = option.instagramOption;
  let work = {
    logs: [],
    instagramWork: [],
    unfollowUser: [],
    friends: {
      date: null,
      value: [],
    },
    beforeText: '',
  }
  logMessage(http, work, option, '작업을 시작합니다.');
  setTimeout(async () => {
    const chromeCapabilities = Capabilities.chrome();
    const args = ['--disable-infobars', '--lang=ko_KR', '--window-size=400,800', `--proxy-server=http://${option.proxyServer}`];
    if (devOption.headless) {
      args.push('--headless');
    }
    const mobileEmulation = {
      deviceMetrics: {
        width: 360,
        height: 640,
        pixelRatio: 3.0,
      },
      userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
    };
    chromeCapabilities.set('chromeOptions', { args, mobileEmulation});
    driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();

    await driver.get('https://www.instagram.com/?hl=ko');
    await loadCookie(driver, option.cookie);
    // 로그인성공 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    while(isRepeat) {
      try {
        if (await checkLogin(driver)) {
          await driver.get('https://www.instagram.com/?hl=ko');
          await driver.manage().deleteCookie('sessionid');
          await driver.navigate().refresh();
          await driver.findElement(By.xpath('//button')).click();
          await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
          await saveCookieAndUsername(driver, http, option);
          break;
        } else {
          if (devOption.headless) {
            const cookie = await IdPwLogin(http, work, option);
            await loadCookie(driver, cookie);
          } else {
            const cookie = await IdPwLogin(http, work, option, driver);
            await loadCookie(driver, cookie);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    
    let beforeTime = 0;
    while(isRepeat) {
      try {
        if (checkActiveTime(setting.activeTimes)) {
          const currentTime = new Date().getTime();
          if (currentTime > new Date(option.expired).getTime()) {
            break;
          }
          if (setting.followType === 1) {
            if(setting.targetTags.length < 1) {
              break;
            }
            if (checkOmit(devOption, worklog)) {
              logMessage(http, work, option, '액션누락발생 작업을 1일간 중지합니다. ');
              await sleep(60);
              continue;
            }
            
            if (currentTime - beforeTime >= CHECK_TIME) {
              work.instagramWork = await getInstagramWork(http, work.instagramWork);
              if (!work.unfollowUser || work.unfollowUser.length < 1) {
                work.unfollowUser = await getUnfollowUser(http, setting, option.email);
              }
              await saveAccountLogAndProfile(http, driver, option);
              beforeTime = currentTime;
            }

            for (let hashtag of setting.targetTags) {
              if (!isRepeat) break;
              if (checkOmit(devOption, worklog)) break;
              // 활동시간 체크 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
              if (checkActiveTime(setting.activeTimes)) {
                if (checkFollowLimit(worklog, setting) || checkLikeLimit(worklog, setting) || checkCommentLimit(worklog, setting)) {
                  try {
                    await driver.get(`https://www.instagram.com/explore/tags/${hashtag}/?hl=ko`);
                    await driver.wait(until.elementLocated(By.xpath('//h2[text()="최근 사진"]/following-sibling::div//a[contains(@href, "/p/")]')), 5000);
                  } catch(e) {
                    continue;
                  }
  
                  const data = await driver.executeScript('return _sharedData.entry_data.TagPage[0].graphql.hashtag');
                  const links = data.edge_hashtag_to_media.edges.map(item => item.node.shortcode);
  
                  let count = 0;
                  for (let link of links) {//shuffle(links)) {
                    if (!isRepeat) break;
                    if (checkOmit(devOption, worklog)) break;
                    
                    setting.processingInterval = (Math.random() * 40) + 40;
                    console.log(setting.processingInterval);

                    const currentTime = new Date().getTime();
                    if (currentTime > new Date(option.expired).getTime()) {
                      break;
                    }

                    if (currentTime - beforeTime >= CHECK_TIME) {
                      work.instagramWork = await getInstagramWork(http, work.instagramWork);
                      if (!work.unfollowUser || work.unfollowUser.length < 1) {
                        work.unfollowUser = await getUnfollowUser(http, setting, option.email);
                      }
                      await saveAccountLogAndProfile(http, driver, option);
                      beforeTime = currentTime;
                    }
  
                    if (checkActiveTime(setting.activeTimes) && checkProccesingCountPerTag(count, setting)) {
                      if (!isRepeat) break;
                      // if(new Date().getTime - startTime >= 60*20*1000) {
                      //   await InstagramWorkWorker(driver, http, worklog, setting, instagramWork);
                      // }
                      await driver.get(`https://www.instagram.com/p/${link}/?hl=ko`);
                      try {
                        await driver.wait(until.elementLocated(By.xpath('(//div[@class="bY2yH"]/button[contains(text(), "팔로")]) | (//div[@class="bY2yH"]/button[contains(text(), "Follow")])')), 5000);
                      } catch(e) {
                        continue;
                      }
  
                      const data = await driver.executeScript('return _sharedData.entry_data.PostPage[0].graphql.shortcode_media');
                      // const user = data.owner.username;
                      // const postUrl = data.shortcode;
                      
                      if (checkProcessingProbability(setting) && await spamCheck(setting, data)) {
                        let doWork = false;
                        let omit = false;
                        if (checkFollowLimit(worklog, setting) && checkLikeLimit(worklog, setting) && checkCommentLimit(worklog, setting)) {
                          if (data.owner.followed_by_viewer === false && data.viewer_has_liked === false && data.comments_disabled === false) {
                            omit = await followLikeComment(driver, http, 'flc', setting, option, work, worklog, hashtag, data);
                            await sleep(setting.processingInterval / 2);
                            doWork = true;
                          }
                        } else if (checkFollowLimit(worklog, setting) && checkLikeLimit(worklog, setting)) {
                          if (data.owner.followed_by_viewer === false && data.viewer_has_liked === false) {
                            omit = await followLikeComment(driver, http, 'fl', setting, option, work, worklog, hashtag, data);
                            await sleep(setting.processingInterval / 2);
                            doWork = true;
                          }
                        } else if (checkFollowLimit(worklog, setting) && checkCommentLimit(worklog, setting)) {
                          if (data.owner.followed_by_viewer === false && data.comments_disabled === false) {
                            omit = await followLikeComment(driver, http, 'fc', setting, option, work, worklog, hashtag, data);
                            await sleep(setting.processingInterval / 2);
                            doWork = true;
                          }
                        } else if (checkLikeLimit(worklog, setting) && checkCommentLimit(worklog, setting)) {
                          if (data.viewer_has_liked === false && data.comments_disabled === false) {
                            omit = await followLikeComment(driver, http, 'lc', setting, option, work, worklog, hashtag, data);
                            await sleep(setting.processingInterval / 2);
                            doWork = true;
                          }
                        } else if (checkFollowLimit(worklog, setting)) {
                          if (data.owner.followed_by_viewer === false) {
                            omit = await followLikeComment(driver, http, 'f', setting, option, work, worklog, hashtag, data);
                            await sleep(setting.processingInterval / 2);
                            doWork = true;
                          }
                        } else if (checkLikeLimit(worklog, setting)) {
                          if (data.viewer_has_liked === false) {
                            omit = await followLikeComment(driver, http, 'l', setting, option, work, worklog, hashtag, data);
                            await sleep(setting.processingInterval / 2);
                            doWork = true;
                          }
                        } else if (checkCommentLimit(worklog, setting)) {
                          if (data.comments_disabled === false) {
                            omit = await followLikeComment(driver, http, 'c', setting, option, work, worklog, hashtag, data);
                            await sleep(setting.processingInterval / 2);
                            doWork = true;
                          }
                        }

                        if (omit) {
                          await driver.get('https://www.instagram.com/?hl=ko');
                          await driver.manage().deleteCookie('sessionid');
                          await driver.navigate().refresh();
                          await driver.findElement(By.xpath('//button')).click();
                          await driver.wait(until.elementLocated(By.xpath('//a[span[@aria-label="프로필"]]')), 10000);
                          while (true) {
                            if (await checkLogin(driver)) {
                              await saveCookieAndUsername(driver, http, option);
                              saveLogDetail(http, work);
                              break;
                            } else {
                              await sleep(5);
                            }
                          }
                          break;
                        }
                        
                        if (doWork) {
                          if (checkUnfollowLimit(worklog, setting)) {
                            await checkFollowback(driver, http, worklog, option.email, work);
                          }
                          count++;
                          saveLogDetail(http, work);
                          await sleep(setting.processingInterval / 2);
                        }
                        await sleep(2);
                      } else {
                        await sleep((setting.processingInterval / 2) + (Math.random() * (setting.processingInterval / 2)));
                      }
                    } else {
                      break;
                    }
                  }
                } else {
                  if (checkUnfollowLimit(worklog, setting)) {
                    await checkFollowback(driver, http, worklog, option.email, work);
                  }
                  saveLogDetail(http, work);
                  await sleep(setting.processingInterval);
                }
              } else {
                await sleep(60);
                break;
              }
            }
          } else if (setting.followType === 2) {
            if (checkOmit(devOption, worklog)) {
              logMessage(http, work, option, '액션누락발생 작업을 1일간 중지합니다. ');
              await sleep(60);
              continue;
            }
            await checkFriends(driver, work, http, option.email);
            let followers = null;
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
            let f_index = 0;
            if (followers.length > 0) {
              while (followers.length > f_index) {
                if (!isRepeat) break;
                if (checkOmit(devOption, worklog)) {
                  await sleep(60);
                  continue;
                }
                const currentTime = new Date().getTime();
                if (currentTime > new Date(option.expired).getTime()) {
                  break;
                }

                if (currentTime - beforeTime >= CHECK_TIME) {
                  await saveAccountLogAndProfile(http, driver, option);
                  beforeTime = currentTime;
                }

                const follower = followers[f_index];
                if (checkActiveTime(setting.activeTimes)) {
                  if (currentTime - beforeTime >= CHECK_TIME) {
                    work.instagramWork = await getInstagramWork(http, work.instagramWork);
                    await saveAccountLogAndProfile(http, driver, option);
                    beforeTime = currentTime;
                  }
  
                  if (checkLikeLimit(worklog, setting) || checkCommentLimit(worklog, setting)) {
                    try {
                      await driver.get(`https://www.instagram.com/${follower.name}/?hl=ko`);
                      const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
                      if (data.edge_owner_to_timeline_media.edges.length > 0) {
                        let index = 1;
                        for (const edge of data.edge_owner_to_timeline_media.edges) {
                          if (index > setting.likePerFollower && index > setting.commentPerFollower) {
                            break;
                          }
                          await driver.get(`https://www.instagram.com/p/${edge.node.shortcode}/?hl=ko`);
                          const post = await driver.executeScript('return _sharedData.entry_data.PostPage[0].graphql.shortcode_media');
                          const postUrl = post.shortcode;
                          const currentDate = new Date();
  
                          if (index <= setting.likePerFollower && post.viewer_has_liked === false && checkLikeLimit(worklog, setting)) {
                            const likeResult = await clickLike(driver);
                            const currentDate = new Date();
                            if (likeResult === true) {
                              worklog.likeCount++;
                              work.logs.push(new LogDetail(2, false, option.email, toLocaleDateString(currentDate), null, toLocaleTimeString(currentDate), postUrl, null));
                            } else if (likeResult === 'omit') {
                              worklog.likeCount++;
                              worklog.likeOmit++;
                              work.logs.push(new LogDetail(2, true, option.email, toLocaleDateString(currentDate), null, toLocaleTimeString(currentDate), postUrl, null));
                              await sleep(60);
                            }
                            await sleep(1);
                          }

                          if (index <= setting.commentPerFollower && post.comments_disabled === false && checkCommentLimit(worklog, setting)) {
                            const comment = getComment(setting, data);
                            if (comment) {
                              const currentDate = new Date();
                              const commentResult = await submitComment(driver, comment, option.username);
                              if (commentResult === true) {
                                worklog.comment++;
                                work.logs.push(new LogDetail(3, false, option.email, toLocaleDateString(currentDate), null, toLocaleTimeString(currentDate), postUrl, comment));
                                await sleep(1);
                              } else if (commentResult === 'omit') {
                                worklog.comment++;
                                worklog.commentOmit++;
                                work.logs.push(new LogDetail(3, true, option.email, toLocaleDateString(currentDate), null, toLocaleTimeString(currentDate), postUrl, comment));
                                await sleep(60);
                              }
                            }
                          }
                          index++;
                        }
                      }
                    } catch (e) {
                      console.log(e);
                    }
                    f_index++;
                    saveLogDetail(http, work);
                    await sleep(setting.processingInterval);
                  } else {
                    await sleep(60);
                  }
                } else {
                  await sleep(60);
                }
              }
            } else {
              await sleep(60);
            }
          } else if (setting.followType === 3) {
            await checkFriends(driver, work, http, option.email);
            let unfollow = null;
            if (setting.unfollowType === 1) {
              unfollow = work.friends.value.filter(item => item.following === true && item.follower === false);
            } else if (setting.unfollowType === 2) {
              unfollow = work.friends.value.filter(item => item.following === true);
            }
            unfollow = unfollow.filter(item => !setting.targetUsers.includes(item)).reverse();
            if (unfollow.length > 0) {
              let uindex = 0
              while (unfollow.length > uindex) {
                if (!isRepeat) break;
                if (checkOmit(devOption, worklog)) {
                  await sleep(60);
                  continue;
                }
                const currentTime = new Date().getTime();
                if (currentTime > new Date(option.expired).getTime()) {
                  break;
                }
                if (currentTime - beforeTime >= CHECK_TIME) {
                  await saveAccountLogAndProfile(http, driver, option);
                  beforeTime = currentTime;
                }
                const uf = unfollow[uindex];
                if (checkActiveTime(setting.activeTimes) && checkUnfollowLimit(worklog, setting)) {
                  try {
                    await driver.get(`https://www.instagram.com/${uf.name}/?hl=ko`);
                    const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
                    if (data.followed_by_viewer === true) {
                      const unfollowResult = await clickUnfollow(driver);
                      const currentDate = new Date();
                      if (unfollowResult === true) {
                        worklog.unfollow++;
                        work.logs.push(new LogDetail(4, false, option.email, toLocaleDateString(currentDate), null, toLocaleTimeString(currentDate), uf.name, null, true));
                        uf.following = false;
                      } else if (unfollowResult === 'omit') {
                        work.logs.push(new LogDetail(4, true, option.email, toLocaleDateString(currentDate), null, toLocaleTimeString(currentDate), uf.name, null, true));
                        worklog.unfollow++;
                        worklog.unfollowOmit++;
                        uindex--;
                        await sleep(60);
                      }
                    } else {
                      uf.following = false;
                    }
                  } catch (e) {
                    uf.following = false;
                    console.log(e);
                  }
                  saveLogDetail(http, work);
                  uindex++;
                } else {
                  await sleep(60);
                }
                await sleep(60);
              }
            } else {
              logMessage(http, work, option, '언팔로우할 유저가 없습니다.');
              await sleep(60);
            }
          }
        } else {
          logMessage(http, work, option, '작업 활성화 시간이 아닙니다.');
          await sleep(60);
        }
      } catch(e) {
        console.log(e);
        if (e.name === 'NoSuchSessionError' || e.name === 'WorkBreak') {
          break;
        }
      }
    }

    try {
      await driver.quit();
    } catch (e) {};
    
    console.log(`${option.email} thread_end`);
  }, 1);

  return () => {
    console.log(`${option.email} end`);
    logMessage(http, work, option, '작업을 종료합니다.');
    saveLogDetail(http, work);
    isRepeat = false;
    if (driver) {
      driver.quit();
      return true;
    }
    return false;
  };
}

export default run;