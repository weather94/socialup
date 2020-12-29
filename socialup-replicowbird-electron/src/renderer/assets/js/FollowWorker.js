/* eslint-disable */
// import { Builder, By, until, Capabilities, Key } from 'selenium-webdriver';
import LogDetail from './LogDetail';
// import WorkLog from './WorkLog';
// import InstagramWorkWorker from './InstagramWorkWorker';
// import IdPwLogin from './IdPwLogin';

const CHECK_TIME = 60*10*1000;
//60*5*1000
// const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
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
  const text = data;

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

async function clickFollow(followButton, option, work, worklog, setting, user, hashtag) {
  try {
    const flag = (setting.mutualFollowingTimeout > 0) ? true : false;
    await followButton.click()
    const followDate = new Date();
    work.logs.push(new LogDetail(1, false, option.email, toLocaleDateString(followDate), null, toLocaleTimeString(followDate), user, hashtag, flag));
    worklog.follow++;
    return true;
  } catch(e) {
    console.log(e)
    if (e.name === 'NoSuchSessionError') {
      throw {name: 'NoSuchSessionError'};
    }
    return false;
  }
}

async function clickLike(likeButton, option, work, worklog) {
  try {
    await likeButton.click();
    const likeDate = new Date();
    work.logs.push(new LogDetail(2, false, option.email, toLocaleDateString(likeDate), null, toLocaleTimeString(likeDate), null, null));
    worklog.likeCount++;
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

async function submitComment(running, driver, setting, option, tag, work, worklog) {
  const comment = getComment(setting, tag);
  let commentButtons = await driver.elements("id", "row_feed_button_comment");
  await commentButtons[0].click();

  let count = 0;
  while (running.state) {
    try {
      let commentEditText = await driver.element("id", "layout_comment_thread_edittext");

      await commentEditText.click();
      await commentEditText.type(comment);
      
      const emojis = await driver.elements("id", "item_emoji");
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      await emoji.click();

      await sleep(2);
                  
      const summitButton = await driver.element("id", "layout_comment_thread_post_button");
      await summitButton.click();
      await sleep(5);

      break;
    } catch(e) {
      console.log(`[ERROR] submitComment : first Loop ${count} => ${e.name}`);
      count++;
    }
    if (count > 10) {
      throw {name: 'error - first LOOP'};
    }
    await sleep(1);
  }

  await sleep(3);
  const commentDate = new Date();
  try {
    const summitButton = await driver.element("id", "negative_button");
    const body = await (await driver.element("id", "dialog_body")).text();
    console.log(body);
    await summitButton.click();
    work.logs.push(new LogDetail(3, false, option.email, toLocaleDateString(commentDate), null, toLocaleTimeString(commentDate), 'error', body));
  } catch(e) {
    console.log(e);
    work.logs.push(new LogDetail(3, false, option.email, toLocaleDateString(commentDate), null, toLocaleTimeString(commentDate), null, comment));
  }
  count = 0;
  while (running.state) {
    try {
      const backButton = await driver.element("id", "action_bar_button_back");
      await backButton.click();
      break;
    } catch(e) {
      console.log(`[ERROR] submitComment : backButton.click() => ${e.name}`);
      count++;
    }
    if (count > 10) {
      throw {name: 'error - backButton.click()'};
    }
    await sleep(1);
  }
  worklog.comment++;
  return true;
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
  console.log('[log]saveAccountLogAndProfile1');
  let elementTwo = await driver.elements("id", "tab_icon");
  await elementTwo[4].click();
  await sleep(5);
  let boardC;
  let followerC;
  let followingC;
  let username;
  let fullname;
  let biography;
  console.log('[log]saveAccountLogAndProfile2');
  try {
    boardC = await (await driver.element("id", "row_profile_header_textview_post_count")).text();
    boardC = Number(boardC.replace(',', ''));
  } catch (e) {
    boardC = 0;
  }
  try {
    followerC = await (await driver.element("id", "row_profile_header_textview_followers_count")).text();
    followerC = Number(followerC.replace(',', ''));
  } catch (e) {
    followerC = 0;
  }
  try {
    followingC = await (await driver.element("id", "row_profile_header_textview_following_count")).text();
    followingC = Number(followingC.replace(',', ''));
  } catch (e) {
    followingC = 0;
  }
  try {
    username = await (await driver.element("id", "title_view")).text();
  } catch (e) {
    username = "";
  }
  try {
    fullname = await (await driver.element("id", "profile_header_full_name")).text();
  } catch (e) {
    fullname = "";
  }
  try {
    biography = await (await driver.element("id", "row_profile_header_bio_text")).text();
  } catch (e) {
    biography = "";
  }
  http.post('api/instagram/log/account', {
    email: option.email,
    date: new Date().toLocaleDateString(),
    board: boardC,
    follower: followerC,
    following: followingC,
  });
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

async function myFeedView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[0].click();
    const random = Math.floor(5 + Math.random()*30);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "sticky_header_list");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 피드보기 에러: ${e.name}`);
  }
}

async function myDmView(running, driver) {
  try {
    await gotoMain(running, driver);
    const element = await driver.element("id", "action_bar_inbox_button");
    await element.click();
    const random = Math.floor(Math.random()*10);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "inbox_refreshable_thread_list_recyclerview");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
    const inboxs = await driver.elements("id", "row_inbox_container");
    const inbox = inboxs[Math.floor(Math.random()*inboxs.length)];
    inbox.click();

    const random2 = Math.floor(Math.random()*10);
    // console.log(`랜덤카운트 : ${random2}`);
    for (let i=0; i<random2; i++) {
      const element = await driver.element("id", "message_list");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      // console.log(`${i} - flick(0, ${random1 + random2}, ${random1 + random3});`)
      await element.flick(0, random1 + random2, random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 디엠보기 에러: ${e.name}`);
    console.log(e);
  }
}

async function viewStory(running, driver) {
  try {
    await gotoMain(running, driver);
    await sleep(2);
    const element = await driver.elements("id", "outer_container");
    await element[1].click();
    const random = Math.floor(40 + Math.random()*60);
    for (let i=0; i<random; i++) {
      const random1 = Math.floor(Math.random()*100);
      // console.log(`pass number : ${random1}`);
      if (random1 < 50) {
        const element = await driver.element("id", "bottom_sheet_container");
        const random1 = Math.floor(200 + Math.random()*200);
        const random2 = Math.floor(Math.random()*150);
        const random3 = Math.floor(Math.random()*147);
        // console.log(`${i} - flick(${-(random1 + random2)}, 0, ${random1 + random3});`)
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
    // console.log(`나의 viewStory 에러: ${e.name}`);
    console.log(e);
  }
}

async function myProfileView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[4].click();
    const random = Math.floor(1 + Math.random()*10);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "coordinator_root_layout");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 피드보기 에러: ${e.name}`);
  }
}

async function myProfileFollowerView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[4].click();
    await sleep(2);
    const element2 = await driver.element("id", "row_profile_header_followers_container");
    await element2.click();
    const random = Math.floor(1 + Math.random()*20);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "layout_listview_parent_container");
      const random1 = Math.floor(10 + Math.random()*2000);
      const random2 = Math.floor(Math.random()*169);
      const random3 = Math.floor(Math.random()*152);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${Math.floor((random1 + random3)/10)});`)
      await element.flick(0, -(random1 + random2), Math.floor((random1 + random3)/10));
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 myProfileFollowerView 에러: ${e.name}`);
    console.log(e);
  }
}

async function myProfileFollowingView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[4].click();
    await sleep(2);
    const element2 = await driver.element("id", "row_profile_header_following_container");
    await element2.click();
    const random = Math.floor(1 + Math.random()*20);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "layout_listview_parent_container");
      const random1 = Math.floor(10 + Math.random()*2000);
      const random2 = Math.floor(Math.random()*179);
      const random3 = Math.floor(Math.random()*163);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${Math.floor((random1 + random3)/10)});`)
      await element.flick(0, -(random1 + random2), Math.floor((random1 + random3)/10));
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 myProfileFollowingView 에러: ${e.name}`);
    console.log(e);
  }
}

async function myActiveView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[3].click();
    const random = Math.floor(5 + Math.random()*30);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "newsfeed_pager");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 myActiveView 에러: ${e.name}`);
    console.log(e);
  }
} 

async function searchView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[1].click();
    const random = Math.floor(10 + Math.random()*60);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "recycler_view");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*150);
      const random3 = Math.floor(Math.random()*147);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await rsleep(0, 4);
    }
  } catch(e) {
    console.log(`나의 searchView 에러: ${e.name}`);
  }
}

async function searchImageView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[1].click();

    await sleep(2);

    const imageElements = await driver.elements("id", "image_button");
    const key = Math.floor(Math.random()*imageElements.length);
    await imageElements[key].click();

    const random = Math.floor(10 + Math.random()*60);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "sticky_header_list");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*151);
      const random3 = Math.floor(Math.random()*148);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await rsleep(0, 2);
    }
  } catch(e) {
    console.log(`나의 searchImageView 에러: ${e.name}`);
    console.log(e);
  }
}

async function randomProfileView(running, driver) {
  try {
    await gotoMain(running, driver);
    const bottomBar = await driver.elements("id", "tab_icon");
    await bottomBar[1].click();

    await rsleep(2, 3);

    const imageElements = await driver.elements("id", "image_button");
    const key = Math.floor(Math.random()*imageElements.length);
    await imageElements[key].click();

    await rsleep(0, 1);

    const profileName = await driver.elements("id", "row_feed_photo_profile_name");
    await profileName[0].click();

    const random = Math.floor(1 + Math.random()*10);
    for (let i=0; i<random; i++) {
      const element = await driver.element("id", "coordinator_root_layout");
      const random1 = Math.floor(200 + Math.random()*200);
      const random2 = Math.floor(Math.random()*155);
      const random3 = Math.floor(Math.random()*152);
      // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
      await element.flick(0, -(random1 + random2), random1 + random3);
      await sleep(0);
    }
  } catch(e) {
    console.log(`나의 randomProfileView 에러: ${e.name}`);
    console.log(e);
  }
}

async function gotoMain(running, driver) {
  let count = 0;
  while(running.state) {
    if (count > 10) {
      break;
    }
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
          break;
        } else {
          await driver.back();
        }
      }
    } catch(e) { break; }
    count += 1;
    await sleep(1);
  }
}

async function recentPost(running, driver, hashtag) {
  while(running.state) {
    let count = 0;
    try {
      await gotoMain(running, driver);
      const elementTwo = await driver.elements("id", "tab_icon");
      await elementTwo[1].click();
      let searchEditText = await driver.element("id", "action_bar_search_edit_text");
      await searchEditText.click();
      await searchEditText.type(hashtag);
      await driver.hideDeviceKeyboard();
      let searchHashs = await driver.elements("id", "row_hashtag_textview_tag_name");
      let searchTag = null;
      for (let searchHash of searchHashs) {
        let name = await searchHash.text();
        if (name === `#${hashtag}`) {
          searchTag = searchHash;
          break;
        }
      }
      await searchTag.click();
      break;
    } catch(e) {
      count += 1;
      if (count > 10) {
        throw {name: 'No SearchHash'};
      }
      await sleep(1);
    }
  }
  
  await sleep(3);
  while(running.state) {
    let count = 0;
    try {
      let tabButtons = await driver.elements("class name", "android.widget.TextView");
      let recentButton = null;
    
      for (let tabButton of tabButtons) {
        let name = await tabButton.text();
        if (name === '최근 게시물') {
          recentButton = tabButton;
          break;
        }
      }
      await recentButton.click();
      break;
    } catch(e) {
      count += 1;
      if (count > 10) {
        throw {name: 'Not Found RecentButton'};
      }
      await sleep(1);
    }
  }

  await rsleep(2,4);

  
  while(running.state) {
    let count = 0;
    try {
      let imageViews = await driver.elements("class name", "android.widget.ImageView");
      let imageElements = [];
      for(let imageView of imageViews) {
        const desc = await imageView.getAttribute("content-desc");
        if (desc && desc.includes('사진')) {
          imageElements.push(imageView);
        }
      }
      console.log(imageViews.length);
      console.log(imageElements.length);

      if (imageElements.length < 1) {
        throw {name: 'Not Load imageViews'};
      } 
      const key = Math.floor(Math.random()*imageElements.length);
      await imageElements[key].click();
      break;
    } catch(e) {
      console.log('eerrrr');
      console.log(e);
      count += 1;
      if (count > 10) {
        throw {name: 'Not Found imageViews'};
      }
      await sleep(1);
    }
  }
}

function run(store, http, option, worklog, devOption, count) {
  console.log(count);
  const wd = require("wd");
  const running = {
    state: true,
  }
  let driver;
  // let appiumServer;
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

  const opts2 = {
    platformName: "Android",
    platformVersion: option.platformVersion,
    deviceName: option.deviceName,
    appPackage: "com.instagram.android",
    appActivity: "com.instagram.mainactivity.MainActivity",
    systemPort: 8200 + count,
    fullReset: "false",
    noReset: "true",
  };
  
  logMessage(http, work, option, '작업을 시작합니다.');
  setTimeout(async () => {
    let beforeTime = 0;
    while(running.state) {
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

            // if (currentTime - beforeTime >= CHECK_TIME) {
            //   await saveAccountLogAndProfile(http, driver, option);
            //   beforeTime = currentTime;
            // }

            for (let hashtag of shuffle(setting.targetTags)) {
              if (!running.state) break;
              if (checkOmit(devOption, worklog)) break;

              try { await driver.quit(); } catch (e) { };
              driver = await wd.promiseChainRemote({
                host: '127.0.0.1',
                port: option.appiumPort,
              });
              await driver.init(opts2);
              console.log(hashtag);
              let sleepTime = 0;
              // 활동시간 체크 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
              
              let dummyAction = [myFeedView, myDmView, viewStory, myProfileView, myProfileFollowerView, myProfileFollowingView, myActiveView, searchView, searchImageView, randomProfileView];
              dummyAction = shuffle(dummyAction);

              let _tempPercent = Math.random()*100;
              if (_tempPercent < 40) {
                console.log(`before-DummyAction : ${dummyAction[0].name} - START`);
                logMessage(http, work, option, `before-DummyAction:${dummyAction[0].name}`);
                await dummyAction[0](running, driver);
                console.log(`before-DummyAction : ${dummyAction[0].name} - END`);
              } else {
                console.log(`before-DummyAction:PASS (${_tempPercent})`);
                logMessage(http, work, option, `before-DummyAction:PASS`);
              }

              _tempPercent = Math.random()*100;
              if (_tempPercent < 85) {
                if (checkActiveTime(setting.activeTimes)) {
                  if (checkFollowLimit(worklog, setting) || checkLikeLimit(worklog, setting) || checkCommentLimit(worklog, setting)) {
                    await sleep(Math.random()*5 + 3);
                    console.log('log 1');
                    if (currentTime - beforeTime >= CHECK_TIME) {
                      await saveAccountLogAndProfile(http, driver, option);
                      beforeTime = currentTime;
                    }

                    // try {
                      await recentPost(running, driver, hashtag);
                    // } catch(e) {
                    //   console.log(e);
                    //   continue;
                    // }
                    
                    const randomCount = 10 + Math.floor(Math.random() * 150);
                    // const randomCount = 5;
                    for (let i = 0; i < randomCount; i++) {
                      if (!running.state) break;
                      if (checkOmit(devOption, worklog)) break;
                      if (checkFollowLimit(worklog, setting) || checkLikeLimit(worklog, setting) || checkCommentLimit(worklog, setting)) {
                        try {
                          let feedHeader = await driver.element("id", "row_feed_profile_header");
                          let feedFooter = await driver.element("id", "row_feed_view_group_buttons");
                          if (feedHeader && feedFooter) {
                            let headerY = (await feedHeader.getLocation()).y;
                            let footerY = (await feedFooter.getLocation()).y;
                            for(let i = 0; headerY < 160 && i < 10; i++) {
                              try {
                                const element = await driver.element("id", "sticky_header_list");
                                const random1 = Math.floor(10 + Math.random()*100);
                                const random2 = Math.floor(Math.random()*50);
                                // console.log(`${i} - flick(0, ${random1 + random2}, ${random1 + random2});`)
                                await element.flick(0, random1 + random2, random1 + random2);
                                headerY = (await feedHeader.getLocation()).y;
                              } catch(e) {
                                console.log(e);
                                await recentPost(running, driver, hashtag);
                              }
                            }
                            if (headerY < footerY) {
                              let followButton = feedHeader.element("id", "button");
                              let buttonText = await followButton.text();
                              if (buttonText === '팔로우') {
                                let commentButton = await feedFooter.element("id", "row_feed_button_comment");
                                if (commentButton && checkCommentLimit(worklog, setting)) {
                                  await submitComment(running, driver, setting, option, hashtag, work, worklog)
                                  feedHeader = await driver.element("id", "row_feed_profile_header");
                                  feedFooter = await driver.element("id", "row_feed_view_group_buttons");
                                }
                                if (checkLikeLimit(worklog, setting)) {
                                  const likeButton = await feedFooter.element("id", "row_feed_button_like");
                                  await clickLike(likeButton, option, work, worklog);
                                }
                                console.log(1);
                                console.log(checkFollowLimit(worklog, setting));
                                if (checkFollowLimit(worklog, setting)) {
                                  console.log(11);
                                  let followButton = null;
                                  for(let i = 0; !followButton && i < 10; i++) {
                                    try {
                                      feedHeader = await driver.element("id", "row_feed_profile_header");
                                      feedFooter = await driver.element("id", "row_feed_view_group_buttons");
                                      headerY = (await feedHeader.getLocation()).y;
                                      footerY = (await feedFooter.getLocation()).y;
                                      if (headerY > footerY) {
                                        throw 'nop!';
                                      }
                                      followButton = await feedHeader.element("id", "button");
                                    } catch(e) {
                                      console.log(e);
                                      try {
                                        console.log('action2');
                                        let action = new wd.TouchAction(driver);
                                        const random = 200 + Math.random()*500;
                                        action.press({x: 200, y: random})
                                          .moveTo({x: 200, y: random + 150})
                                          .release();
                                        await action.perform();
                                      } catch(e) {
                                        console.log(e);
                                      }
                                    }
                                  }
                                  const user = (await (await feedHeader.element("id", "row_feed_photo_profile_name")).text()).replace(/[ •]/g, '');
                                  await clickFollow(followButton, option, work, worklog, setting, user, hashtag);
                                } 
                                sleepTime += (Math.random()*90 + 90);
                                console.log(`sleepTime: ${sleepTime}`);
                              }
                            }
                          }
                        } catch(e) { }

                        try {
                          const element = await driver.element("id", "sticky_header_list");
                          const random1 = Math.floor(200 + Math.random()*240);
                          const random2 = Math.floor(Math.random()*139);
                          const random3 = Math.floor(Math.random()*128);
                          // console.log(`${i} - flick(0, ${-(random1 + random2)}, ${random1 + random3});`)
                          await element.flick(0, -(random1 + random2), random1 + random3);
                        } catch(e) {
                          console.log(e);
                          await recentPost(running, driver, hashtag);
                        }
                      }
                      saveLogDetail(http, work);
                    }
                  } else {
                    saveLogDetail(http, work);
                    await sleep(120);
                  }
                  saveLogDetail(http, work);
                } else {
                  await sleep(120);
                }
              } else {
                console.log(`Follow-Action:PASS (${_tempPercent})`);
                logMessage(http, work, option, `Follow-Action:PASS`);
              }
              
              _tempPercent = Math.random()*100;
              if (_tempPercent < 40) {
                logMessage(http, work, option, `After-DummyAction:${dummyAction[1].name}`);
                console.log(`after-DummyAction : ${dummyAction[1].name} - START`);
                await dummyAction[1](running, driver);
                console.log(`after-DummyAction : ${dummyAction[1].name} - END`);
              } else {
                console.log(`after-DummyAction:PASS (${_tempPercent})`);
                logMessage(http, work, option, `after-DummyAction:PASS`);
              }

              await driver.closeApp();
              await driver.lock();
              try { await driver.quit(); } catch(e) { console.log(e); }
              sleepTime += getWeightRandom();
              console.log(`sleepTime ${sleepTime}`);
              logMessage(http, work, option, `${sleepTime}초 동안 대기합니다.`);
              await sleep(sleepTime);
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
        try { 
          await driver.quit();
          driver = await wd.promiseChainRemote({
            host: '127.0.0.1',
            port: option.appiumPort,
          });
          await driver.init(opts2);
        } catch (e) {
          console.log('double error@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        };
      }
    }

    try {
      await driver.quit();
      // await appiumServer.close();
    } catch (e) {};
    
    console.log(`${option.email} thread_end`);
  }, 1);

  return () => {
    console.log(`${option.email} end`);
    logMessage(http, work, option, '작업을 종료합니다.');
    saveLogDetail(http, work);
    running.state = false;
    if (driver) {
      driver.quit();
      // appiumServer.close();
      return true;
    }
    return false;
  };
}

export default run;