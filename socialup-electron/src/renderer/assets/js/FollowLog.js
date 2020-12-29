class FollowLog {
  constructor(type, omit, tag, text, user, postUrl, userId) {
    this.type = type;
    this.omit = omit;
    this.tag = tag;
    this.text = text;
    this.user = user;
    this.postUrl = postUrl;
    this.userId = userId;
  }
}

export default FollowLog;
