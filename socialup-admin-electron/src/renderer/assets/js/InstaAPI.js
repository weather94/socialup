/* eslint-disable */
import instagram from 'instagram-private-api'
import _ from 'lodash'
import Promise from 'bluebird'
import path from 'path';
import electron from 'electron';

class InstaAPI {
  constructor(){
    this.client = null;
    this.device = null;
    this.storage = null;
    this.session = null;
    this.isLogin = false;
  }

  async login(loginId, loginPw, username) {
    this.client = instagram.V1;
    this.device = new this.client.Device(loginId);
    let userDataPath = (electron.app || electron.remote.app).getPath('userData');
    let filePath = path.join(userDataPath, `${loginId.replace('.', '')}.json`);
    this.storage = new this.client.CookieFileStorage(filePath);
    this.session = await this.client.Session.create(this.device, this.storage, loginId, loginPw);
    const account = await this.client.Account.searchForUser(this.session, username);
    await this.client.Relationship.create(this.session, account.id);
    this.isLogin = true;
  }

  async searchUser(username){
    return await this.client.Account.search(this.session, username);
  }

  async getTaggedMedia(tag, limit) {
    let taggedMedia = new this.client.Feed.TaggedMedia(this.session, tag);
    let feeds = [];
    do {
      feeds = feeds.concat(await taggedMedia.get());
    } while(taggedMedia.isMoreAvailable() && limit > feeds.length)
    return feeds;
  }

  async followMedia(media){
    await this.client.Relationship.create(this.session, media.getParams().user.pk);
  }

  async getAccountByUsername(username){
    return await this.client.Account.searchForUser(this.session, username);
  }

  async getAccountById(accountId){
    return await this.client.Account.getById(this.session, accountId);
  }

  async uploadPhoto(photo, caption){
    let upload = await this.client.Upload.photo(this.session, photo);
    let medium = await this.client.Media.configurePhoto(this.session, upload.params.uploadId, caption);
  }

  async uploadPhotoStory(photo){
    let upload = await this.client.Upload.photo(this.session, photo);
    let medium = await this.client.Media.configurePhotoStory(this.session, upload.params.uploadId);
  }

  async uploadVideo(video, cover, caption){
    let upload = await this.client.Upload.video(this.session, video, cover);
    let medium = await this.client.Media.configureVideo(this.session, upload.uploadId, caption, upload.durationms);
  }

  async uploadAlbum(caption, medias){
    try {
      let payload = await this.client.Upload.album(this.session, medias);
      let medium = await this.client.Media.configureAlbum(this.session, payload, caption, true);
      return true;
    } catch(e) {
      return false;
    }
  }

  async sendDMText(users, content){
    return await this.client.Thread.configureText(this.session, users, content);
  }

  async sendDMPhoto(users, photo){
    let upload = await this.client.Upload.photo(this.session, photo);
    return await this.client.Thread.configurePhoto(this.session, users, upload.params.uploadId);
  }

  async sendDMMedia(users, mediaId){
    return await this.client.Thread.configureText(this.session, users, mediaId);
  }

  async deleteMedia(mediaId){
    return await client.Media.delete(this.session, mediaId);
  }

  async getMediaById(id){
    return await this.client.Media.getById(this.session, id);
  }

  async getMediaByUrl(url){
    return await this.client.Media.getByUrl(this.session, url);
  }

  async getLikers(mediaId){
    return await this.client.Media.likers(this.session, mediaId);
  }

  async getTimeline(limit){
    let timelineFeeds = new this.client.Feed.Timeline(this.session);
    let feeds = [];
    do {
      feeds = feeds.concat(await timelineFeeds.get());
    } while(timelineFeeds.isMoreAvailable() && limit > feeds.length)
    return feeds;
  }

  async getUserMedia(accountId, limit){
    let userMedia = new this.client.Feed.UserMedia(this.session, accountId);
    let feeds = [];
    do {
      try {
        feeds = feeds.concat(await userMedia.get());
      } catch(e) {
        console.log(e);
      }
      console.log(feeds.length);
    } while(userMedia.isMoreAvailable() && limit > feeds.length)
    return feeds;
  }

  async getLocationMedia(locationId, limit){
    let locationMedia = new this.client.Feed.LocationMedia(this.session, locationId);
    let feeds = [];
    do {
      feeds.concat(await locationMedia.get());
    } while(locationMedia.isMoreAvailable() && limit > feeds.length)
    return feeds;
  }

  async getCustomAccountFollowers(username, friends, blackUsers, limit){
    let user = await this.getAccountByUsername(username);
    let accountFollowers = new this.client.Feed.AccountFollowers(this.session, user.id, limit);
    let strFriends = friends.map(item => item.username);
    let list = [];
    do {
      let followers = await accountFollowers.get();
      for (let follower of followers) {
        if (!follower.params.isPrivate &&
            !blackUsers.includes(follower.params.username) &&
            !strFriends.includes(follower.params.username)) {
          list.push(follower);
        }
      }
      list = list.concat();
    } while(accountFollowers.isMoreAvailable() && (!limit || limit > list.length))
    return list.slice(0, limit);
  }

  async getAccountFollowers(accountId, limit){
    let accountFollowers = new this.client.Feed.AccountFollowers(this.session, accountId, limit);
    let list = [];
    do {
      console.log(list.length);
      try {
        list = list.concat(await accountFollowers.get());
      } catch(e) {
        console.log(e);
      }
    } while(accountFollowers.isMoreAvailable() && (!limit || limit > list.length))
    return list;
  }

  async getAccountFollowing(accountId, limit){
    let accountFollowing = new this.client.Feed.AccountFollowing(this.session, accountId, limit);
    let list = [];
    do {
      list = list.concat(await accountFollowing.get());
    } while(accountFollowing.isMoreAvailable() && limit > list.length)
    return list;
  }

  async getSelfLikeFeed(limit){
    let feed = new this.client.Feed.SelfLiked(this.session, limit);
    let feeds = [];
    do {
      feeds.concat(await feed.get());
    } while(feed.isMoreAvailable() && limit > feeds.length)
    return feeds;
  }

  async getInbox(limit){
    let inbox = new this.client.Feed.Inbox(this.session, limit);
    let inboxs = [];
    do {
      inboxs.concat(await inbox.get());
    } while(inbox.isMoreAvailable() && limit > inboxs.length)
    return inboxs;
  }

  async getInboxPending(limit){
    let inbox = new this.client.Feed.InboxPending(this.session, limit);
    let inboxs = [];
    do {
      inboxs.concat(await inbox.get());
    } while(inbox.isMoreAvailable() && limit > inboxs.length)
    return inboxs;
  }

  async getThreadItems(threadId, limit){
    let item = new this.client.Feed.ThreadItems(this.session, threadId, limit);
    let items = [];
    do {
      items = items.concat(await item.get());
    } while(item.isMoreAvailable() && limit > items.length)
    return items;
  }

  async getMediaComments(mediaId, limit){
    let media = new this.client.Feed.MediaComments(this.session, mediaId, limit);
    let medias = [];
    do {
      medias = medias.concat(await media.get());
      console.log(`${medias.length} / ${limit}`);
    // } while(media.isMoreAvailable() && limit > medias.length)
    } while(limit - 1 > medias.length && medias.length > 0)
    return medias.slice(0, limit);
  }

  async getUserStory(userIds){
    let media = new this.client.Feed.UserStory(this.session, userIds);
    let medias = await media.get()
    return medias;
  }

  async getStoryTray(){
    let media = new this.client.Feed.StoryTray(this.session);
    let medias = await media.get();
    return medias;
  }

  async createComment(mediaId, text){
    return await this.client.Comment.create(this.session, mediaId, text);
  }

  async deleteComment(mediaId, commentId){
    return await this.client.Comment.delete(this.session, mediaId, commentId);
  }

  async like(mediaId){
    return await this.client.Like.create(this.session, mediaId);
  }

  async likeMedia(media){
    return await this.client.Like.create(this.session, media.getParams().id);
  }

  async unlike(mediaId){
    return await this.client.Like.destroy(this.session, mediaId);
  }

  async follow(accountId){
    return await this.client.Relationship.create(this.session, accountId);
  }

  async unfollow(accountId){
    return await this.client.Relationship.destroy(this.session, accountId);
  }

  async block(accountId){
    return await this.client.Relationship.block(this.session, accountId);
  }

  async unblock(accountId){
    return await this.client.Relationship.destroy(this.session, accountId);
  }

  async getRelationship(accountId){
    return await this.client.Relationship.get(this.session, accountId);
  }

  async getRelationshipMany(accountIds){
    return await this.client.Relationship.getMany(this.session, accountIds);
  }

  async pendingFollowers(){
    // 아무값도안오는데 뭔값인 지 모르겠다.
    return await this.client.Relationship.pendingFollowers(this.session);
  }

  async approvePending(accountId){
    // 뭔지모르겠따.
    return await this.client.Relationship.approvePending(this.session, accountId);
  }

  async searchLocation(location){
    return await this.client.Location.search(this.session, location);
  }

  async getLankedMediaByLocation(locationId){
    return await this.client.Location.getRankedMedia(this.session. locationId);
  }

  async searchHashtag(tag){
    return await this.client.Hashtag.search(this.session, tag);
  }

  async infoHashtag(tag){
    return await this.client.Hashtag.info(this.session, tag);
  }

  async relatedHashtag(tag){
    return await this.client.Hashtag.related(this.session, tag);
  }
}
//스토리지를 이거 바꾸자 그 로컬스토리지로 어차피 브라우저 쓰니까 ㅋㅋ
let instaAPI = new InstaAPI();
export default instaAPI;
