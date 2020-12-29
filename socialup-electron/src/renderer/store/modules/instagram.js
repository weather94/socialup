import * as _ from 'lodash';

const state = {
  settings: [],
  selectedSetting: null,
  loginId: '',
  loginPw: '',
  account: {},
  username: '',
  profile: null,
  friends: {},
  logs: {},
  accountlogs: {},
  todayKey: null,
  instagramWork: {},
};

const getters = {
  getTodayFollowerCount(state) {
    if (state.accountlogs[state.loginId] && state.accountlogs[state.loginId][state.todayKey]) {
      return state.accountlogs[state.loginId][state.todayKey].follower;
    }
    return null;
  },
  getTodayFollowingCount(state) {
    if (state.accountlogs[state.loginId] && state.accountlogs[state.loginId][state.todayKey]) {
      return state.accountlogs[state.loginId][state.todayKey].following;
    }
    return null;
  },
  getTodayBoardCount(state) {
    if (state.accountlogs[state.loginId] && state.accountlogs[state.loginId][state.todayKey]) {
      return state.accountlogs[state.loginId][state.todayKey].board;
    }
    return null;
  },
  getFriends(state) {
    if (state.friends && state.friends[state.loginId]) {
      return state.friends[state.loginId].friends;
    }
    return null;
  },
  getFollowers(state) {
    if (state.friends && state.friends[state.loginId]) {
      return state.friends[state.loginId].friends.filter(item => item.follower === true);
    }
    return null;
  },
  getFollowings(state) {
    if (state.friends && state.friends[state.loginId]) {
      return state.friends[state.loginId].friends.filter(item => item.following === true);
    }
    return null;
  },
  getOnlyFollowers(state) {
    if (state.friends && state.friends[state.loginId]) {
      return state.friends[state.loginId].friends.filter(item => item.follower === true && item.following === false);
    }
    return null;
  },
  getOnlyFollowings(state) {
    if (state.friends && state.friends[state.loginId]) {
      return state.friends[state.loginId].friends.filter(item => item.following === true && item.follower === false);
    }
    return null;
  },
  getMutuals(state) {
    if (state.friends && state.friends[state.loginId]) {
      return state.friends[state.loginId].friends.filter(item => item.following === true && item.follower === true);
    }
    return null;
  },
  recentlyInstagramLogs(state) {
    if (state.logs[state.loginId] && state.logs[state.loginId][state.todayKey]) {
      return state.logs[state.loginId][state.todayKey].details.slice(-7).reverse();
    }
    return null;
  },
  getInstagramLogs(state) {
    if (state.logs[state.loginId] && state.logs[state.loginId][state.todayKey]) {
      return state.logs[state.loginId][state.todayKey];
    }
    return {
      follow: 0,
      likeCount: 0,
      comment: 0,
      unfollow: 0,
      followback: 0,
      unfollowProcess: 0,
    };
  },
};

const mutations = {
  SET_LOGIN_ID(state, params) {
    state.loginId = params;
  },
  SET_LOGIN_PW(state, params) {
    state.loginPw = params;
  },
  SET_USERNAME(state, params) {
    state.username = params;
  },
  SET_SETTINGS(state, params) {
    state.settings = params;
  },
  ADD_SETTING(state, params) {
    state.settings = state.settings.concat(params);
  },
  REMOVE_SETTING(state, params) {
    state.settings = state.settings.filter(item => item.id !== params);
  },
  UPDATE_FOLLOW_TYPE(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.followType = params.followType;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  UPDATE_COMMENT_TYPE(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.commentType = params.commentType;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  CLEAR_SETTINGS(state) {
    state.settings = [];
  },
  ADD_TARGET_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.targetTags.push(params.value);
    // updateSetting.targetTags = updateSetting.targetTags.concat(params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  REMOVE_TARGET_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.targetTags = updateSetting.targetTags.filter(item => item !== params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  ADD_TARGET_USER(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.targetUsers = updateSetting.targetUsers.concat(params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  REMOVE_TARGET_USER(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.targetUsers = updateSetting.targetUsers.filter(item => item !== params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  ADD_BLACK_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.blackTags.push(params.value);
    // updateSetting.blackTags = updateSetting.blackTags.concat(params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  REMOVE_BLACK_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.blackTags = updateSetting.blackTags.filter(item => item !== params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  ADD_BLACK_USER(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.blackUsers = updateSetting.blackUsers.concat(params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  REMOVE_BLACK_USER(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.blackUsers = updateSetting.blackUsers.filter(item => item !== params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_FOLLOW_LIMIT_PER_DAY(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.followLimitPerDay = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_LIKE_LIMIT_PER_DAY(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.likeLimitPerDay = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_COMMENT_LIMIT_PER_DAY(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.commentLimitPerDay = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_FOLLOW_PROBABILITY(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.followProbability = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_LIKE_PROBABILITY(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.likeProbability = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_COMMENT_PROBABILITY(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.commentProbability = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_PROCESSING_PROBABILITY(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.processingProbability = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_MUTUAL_FOLLOWING_TIMEOUT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.mutualFollowingTimeout = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_PROCESSING_COUNT_PER_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.processingCountPerTag = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_PROCESSING_INTERVAL(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.processingInterval = params.value;
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_UNFOLLOW_TYPE(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.unfollowType = params.value;
  },
  SET_FOLLOWER_ORDER(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.followerOrder = params.value;
  },
  SET_LIKE_PER_FOLLOWER(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.likePerFollower = params.value;
  },
  SET_COMMENT_PER_FOLLOWER(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.commentPerFollower = params.value;
  },
  ADD_AUTO_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.autoComments = updateSetting.autoComments.concat(JSON.parse(JSON.stringify(params.value)));
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  REMOVE_AUTO_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.autoComments = updateSetting.autoComments.filter(item => item.id !== params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  ADD_COMMENT_RULE(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.commentRules = updateSetting.commentRules.concat(JSON.parse(JSON.stringify(params.value)));
  },
  REMOVE_COMMENT_RULE(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.commentRules = updateSetting.commentRules.filter(item => item.id !== params.value);
  },
  ADD_AUTO_COMMENT_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateAutoComment = updateSetting.autoComments.filter(item => item.id === params.acId)[0];
    updateAutoComment.comments = updateAutoComment.comments.concat(params.value);
    // updateSetting.autoComments = updateSetting.autoComments.filter(item => item.id !== params.acId).concat(updateAutoComment);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  REMOVE_AUTO_COMMENT_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateAutoComment = updateSetting.autoComments.filter(item => item.id === params.acId)[0];
    updateAutoComment.comments = updateAutoComment.comments.filter(item => item !== params.value);
    // updateSetting.autoComments = updateSetting.autoComments.filter(item => item.id !== params.acId).concat(updateAutoComment);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  ADD_COMMENT_RULE_INCLUDE_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateCommentRule = updateSetting.commentRules.filter(item => item.id === params.ruleId)[0];
    updateCommentRule.includeTags = updateCommentRule.includeTags.concat(params.value);
  },
  REMOVE_COMMENT_RULE_INCLUDE_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateCommentRule = updateSetting.commentRules.filter(item => item.id === params.ruleId)[0];
    updateCommentRule.includeTags = updateCommentRule.includeTags.filter(item => item !== params.value);
  },
  ADD_COMMENT_RULE_EXCLUDE_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateCommentRule = updateSetting.commentRules.filter(item => item.id === params.ruleId)[0];
    updateCommentRule.excludeTags = updateCommentRule.excludeTags.concat(params.value);
  },
  REMOVE_COMMENT_RULE_EXCLUDE_TAG(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateCommentRule = updateSetting.commentRules.filter(item => item.id === params.ruleId)[0];
    updateCommentRule.excludeTags = updateCommentRule.excludeTags.filter(item => item !== params.value);
  },
  ADD_COMMENT_RULE_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateCommentRule = updateSetting.commentRules.filter(item => item.id === params.ruleId)[0];
    updateCommentRule.comments = updateCommentRule.comments.concat(params.value);
  },
  REMOVE_COMMENT_RULE_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    const updateCommentRule = updateSetting.commentRules.filter(item => item.id === params.ruleId)[0];
    updateCommentRule.comments = updateCommentRule.comments.filter(item => item !== params.value);
  },
  ADD_DEFAULT_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.defaultComments = updateSetting.defaultComments.concat(params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  REMOVE_DEFAULT_COMMENT(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.defaultComments = updateSetting.defaultComments.filter(item => item !== params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SET_ACTIVE_TIMES(state, params) {
    const updateSetting = state.settings.filter(item => item.id === params.id)[0];
    updateSetting.activeTimes = _.cloneDeep(params.value);
    // state.settings = state.settings.filter(item => item.id !== params.id).concat(updateSetting);
  },
  SELECT_SETTING(state, params) {
    state.selectedSetting = params;
  },
  SET_FRIENDS(state, params) {
    if (!state.friends) {
      state.friends = {};
    }
    state.friends[params.id] = {
      date: params.date,
      friends: params.friends,
    };
  },
  CLEAR_FRIENDS(state) {
    state.friends = {};
  },
  REMOVE_FRIEND(state, params) {
    if (state.friends && state.friends[params.id] && state.friends[params.id].friends) {
      const friend = state.friends[params.id].friends.filter(item => item.name === params.name)[0];
      if (friend) {
        if (friend.follower) {
          friend.following = false;
        } else {
          state.friends[params.id].friends = state.friends[params.id].friends.filter(item => item.name !== params.name);
        }
      }
    }
  },
  ADD_INSTAGRAM_LOG(state, obj) {
    const date = new Date();
    const key = date.toLocaleDateString();
    const time = date.toLocaleTimeString('en-GB');
    if (!state.logs[obj.userId]) {
      state.logs[obj.userId] = {};
    }
    if (!state.logs[obj.userId][key]) {
      const logs = _.cloneDeep(state.logs);
      logs[obj.userId][key] = {
        follow: 0,
        likeCount: 0,
        comment: 0,
        unfollow: 0,
        followback: 0,
        followOmit: 0,
        likeOmit: 0,
        commentOmit: 0,
        unfollowProcess: 0,
        details: [],
      };
      state.logs = logs;
    }
    if (obj.type === 1) {
      state.logs[obj.userId][key].follow += 1;
      if (obj.omit === true) {
        state.logs[obj.userId][key].followOmit += 1;
      }
    } else if (obj.type === 2) {
      state.logs[obj.userId][key].likeCount += 1;
      if (obj.omit === true) {
        state.logs[obj.userId][key].likeOmit += 1;
      }
    } else if (obj.type === 3) {
      state.logs[obj.userId][key].comment += 1;
      if (obj.omit === true) {
        state.logs[obj.userId][key].commentOmit += 1;
      }
    } else if (obj.type === 4) {
      state.logs[obj.userId][key].unfollow += 1;
      if (obj.omit === true) {
        state.logs[obj.userId][key].unfollowOmit += 1;
      }
    }

    if (!state.logs[obj.userId][key].details) {
      state.logs[obj.userId][key].details = [];
    }

    state.logs[obj.userId][key].details.push({
      postUrl: obj.postUrl,
      tag: obj.tag,
      text: obj.text,
      type: obj.type,
      user: obj.user,
      time,
    });
  },
  PLUS_INSTAGRAM_LOG(state, params) {
    const date = new Date();
    const key = date.toLocaleDateString();
    if (!state.logs[params.userId]) {
      state.logs[params.userId] = {};
    }
    if (!state.logs[params.userId][key]) {
      const logs = _.cloneDeep(state.logs);
      logs[params.userId][key] = {
        follow: 0,
        likeCount: 0,
        comment: 0,
        unfollow: 0,
        followback: 0,
        followOmit: 0,
        likeOmit: 0,
        commentOmit: 0,
        unfollowProcess: 0,
        details: [],
      };
      state.logs = logs;
    }
    if (params.type === 1) {
      state.logs[params.userId][key].follow += 1;
      if (params.omit === true) {
        state.logs[params.userId][key].followOmit += 1;
      }
    } else if (params.type === 2) {
      state.logs[params.userId][key].likeCount += 1;
      if (params.omit === true) {
        state.logs[params.userId][key].likeOmit += 1;
      }
    } else if (params.type === 3) {
      state.logs[params.userId][key].comment += 1;
      if (params.omit === true) {
        state.logs[params.userId][key].commentOmit += 1;
      }
    } else if (params.type === 4) {
      state.logs[params.userId][key].unfollow += 1;
      if (params.omit === true) {
        state.logs[params.userId][key].unfollowOmit += 1;
      }
    }
  },
  SET_TODAY_KEY(state, params) {
    state.todayKey = params;
  },
  CLEAR_TODAY_KEY(state) {
    state.todayKey = null;
  },
  CLEAR_ALL_INSTAGRAM_LOGS(state) {
    state.logs = {};
  },
  SET_ACCOUNT_LOGS(state, params) {
    const accountlogs = _.cloneDeep(state.accountlogs);
    if (!accountlogs[params.id]) {
      accountlogs[params.id] = {};
    }
    accountlogs[params.id][state.todayKey] = params.value;
    state.accountlogs = accountlogs;
  },
  SET_UNFOLLOW_PROCESS(state, params) {
    if (!state.logs[params.id]) {
      state.logs[params.id] = {};
    }
    if (!state.logs[params.id][params.key]) {
      const logs = _.cloneDeep(state.logs);
      logs[params.id][params.key] = {
        follow: 0,
        likeCount: 0,
        comment: 0,
        unfollow: 0,
        followback: 0,
        followOmit: 0,
        likeOmit: 0,
        commentOmit: 0,
        unfollowProcess: 0,
        details: [],
      };
      state.logs = logs;
    }
    state.logs[params.id][params.key].unfollowProcess = params.value;
  },
  ADD_FOLLOW_BACK(state, params) {
    if (state.logs[params.id] && state.logs[params.id][params.key]) {
      if (state.logs[params.id][params.key].followback) {
        state.logs[params.id][params.key].followback += 1;
      } else {
        state.logs[params.id][params.key].followback = 1;
      }
    }
  },
  SET_PROFILE(state, params) {
    state.profile = params;
  },
  FOLLOW_BACK_TRUE(state, params) {
    if (state.logs[params.id] && state.logs[params.id][params.backKey]) {
      const index = state.logs[params.id][params.backKey].details.findIndex(item => item.type === params.following.type && item.user === params.following.user && item.postUrl === params.following.postUrl);
      params.following.followback = true;
      state.logs[params.id][params.backKey].details.splice(index, 1, params.following);
    }
  },
  UNFOLLOW_TRUE(state, params) {
    if (state.logs[params.id] && state.logs[params.id][params.backKey]) {
      const index = state.logs[params.id][params.backKey].details.findIndex(item => item.type === params.following.type && item.user === params.following.user && item.postUrl === params.following.postUrl);
      params.following.unfollow = true;
      state.logs[params.id][params.backKey].details.splice(index, 1, params.following);
    }
  },
  SET_ALL_LOGS(state, params) {
    state.accountlogs = params.accountlogs;
    state.logs = params.logs;
  },
  SET_ACCOUNT(state, params) {
    state.account[params.id] = params;
  },
  REMOVE_ACCOUNT(state, params) {
    delete state.account[params.id];
  },
  CLEAR_ACCOUNT(state) {
    state.account = {};
  },
  CLEAR_INSTAGRAM_LOG_DETAILS(state, params) {
    delete state.logs[params.id][params.backKey].details;
  },
  LOAD_ACCOUNT_LOGS(state, params) {
    state.accountlogs = {};
    params.forEach((item) => {
      if (!state.accountlogs[item.email]) {
        state.accountlogs[item.email] = {};
      }
      if (!state.accountlogs[item.email][item.date]) {
        state.accountlogs[item.email][item.date] = {};
      }
      state.accountlogs[item.email][item.date].board = item.board;
      state.accountlogs[item.email][item.date].follower = item.follower;
      state.accountlogs[item.email][item.date].following = item.following;
    });
  },
  LOAD_WORK_LOGS(state, params) {
    params.forEach((item) => {
      if (!state.logs[item.email]) {
        state.logs[item.email] = {};
      }
      if (!state.logs[item.email][item.date]) {
        state.logs[item.email][item.date] = {};
      }
      if (!state.logs[item.email][item.date].comment || state.logs[item.email][item.date].comment < item.comment) {
        state.logs[item.email][item.date].comment = item.comment;
      }
      if (!state.logs[item.email][item.date].follow || state.logs[item.email][item.date].follow < item.follow) {
        state.logs[item.email][item.date].follow = item.follow;
      }
      if (!state.logs[item.email][item.date].followback || state.logs[item.email][item.date].followback < item.followback) {
        state.logs[item.email][item.date].followback = item.followback;
      }
      if (!state.logs[item.email][item.date].likeCount || state.logs[item.email][item.date].likeCount < item.likeCount) {
        state.logs[item.email][item.date].likeCount = item.likeCount;
      }
      if (!state.logs[item.email][item.date].unfollow || state.logs[item.email][item.date].unfollow < item.unfollow) {
        state.logs[item.email][item.date].unfollow = item.unfollow;
      }
      if (!state.logs[item.email][item.date].unfollowProcess || state.logs[item.email][item.date].unfollowProcess < item.unfollowProcess) {
        state.logs[item.email][item.date].unfollowProcess = item.unfollowProcess;
      }
      if (!state.logs[item.email][item.date].followOmit || state.logs[item.email][item.date].followOmit < item.followOmit) {
        state.logs[item.email][item.date].followOmit = item.followOmit;
      }
      if (!state.logs[item.email][item.date].likeOmit || state.logs[item.email][item.date].likeOmit < item.likeOmit) {
        state.logs[item.email][item.date].likeOmit = item.likeOmit;
      }
      if (!state.logs[item.email][item.date].commentOmit || state.logs[item.email][item.date].commentOmit < item.commentOmit) {
        state.logs[item.email][item.date].commentOmit = item.commentOmit;
      }
      if (!state.logs[item.email][item.date].unfollowOmit || state.logs[item.email][item.date].unfollowOmit < item.unfollowOmit) {
        state.logs[item.email][item.date].unfollowOmit = item.unfollowOmit;
      }
    });
  },
  SAVE_INSTAGRAM_WORK(state, params) {
    if (!state.instagramWork[params.id] || state.instagramWork[params.id].length < 1) {
      state.instagramWork[params.id] = params.works;
    } else {
      const newInstagramWork = [];
      params.works.forEach((item) => {
        const result = state.instagramWork[params.id].filter(work => item.id === work.id)[0];
        if (result) {
          newInstagramWork.push(result);
        } else {
          newInstagramWork.push(item);
        }
      });
      state.instagramWork[params.id] = newInstagramWork;
    }
  },
  REMOVE_INSTAGRAM_WORK(state, params) {
    state.instagramWork[params.id] = state.instagramWork[params.id].filter(item => item.id !== params.value);
  },
  PROCESSING_INSTAGRAM_WORK(state, params) {
    const work = state.instagramWork[params.id].filter(item => item.id === params.value)[0];
    if (work) {
      work.process = true;
    }
  },
};

const actions = {
  setLoginId({ commit }, params) {
    commit('SET_LOGIN_ID', params);
  },
  setLoginPw({ commit }, params) {
    commit('SET_LOGIN_PW', params);
  },
  setUsername({ commit }, params) {
    commit('SET_USERNAME', params);
  },
  setSettings({ commit }, params) {
    commit('SET_SETTINGS', params);
    if (params) {
      commit('SELECT_SETTING', params[0]);
    }
  },
  addSetting({ commit }, params) {
    commit('ADD_SETTING', params);
  },
  removeSetting({ commit }, params) {
    commit('REMOVE_SETTING', params);
  },
  clearSettings({ commit }) {
    commit('CLEAR_SETTINGS');
  },
  updateFollowType({ commit }, params) {
    commit('UPDATE_FOLLOW_TYPE', params);
  },
  updateCommentType({ commit }, params) {
    commit('UPDATE_COMMENT_TYPE', params);
  },
  addTargetTag({ commit }, params) {
    commit('ADD_TARGET_TAG', params);
  },
  removeTargetTag({ commit }, params) {
    commit('REMOVE_TARGET_TAG', params);
  },
  addTargetUser({ commit }, params) {
    commit('ADD_TARGET_USER', params);
  },
  removeTargetUser({ commit }, params) {
    commit('REMOVE_TARGET_USER', params);
  },
  addBlackTag({ commit }, params) {
    commit('ADD_BLACK_TAG', params);
  },
  removeBlackTag({ commit }, params) {
    commit('REMOVE_BLACK_TAG', params);
  },
  addBlackUser({ commit }, params) {
    commit('ADD_BLACK_USER', params);
  },
  removeBlackUser({ commit }, params) {
    commit('REMOVE_BLACK_USER', params);
  },
  setProcessingCountPerTag({ commit }, params) {
    commit('SET_PROCESSING_COUNT_PER_TAG', params);
  },
  setProcessingInterval({ commit }, params) {
    commit('SET_PROCESSING_INTERVAL', params);
  },
  setLikeProbability({ commit }, params) {
    commit('SET_LIKE_PROBABILITY', params);
  },
  setFollowProbability({ commit }, params) {
    commit('SET_FOLLOW_PROBABILITY', params);
  },
  setCommentProbability({ commit }, params) {
    commit('SET_COMMENT_PROBABILITY', params);
  },
  setProcessingProbability({ commit }, params) {
    commit('SET_PROCESSING_PROBABILITY', params);
  },
  setLikeLimitPerDay({ commit }, params) {
    commit('SET_LIKE_LIMIT_PER_DAY', params);
  },
  setFollowLimitPerDay({ commit }, params) {
    commit('SET_FOLLOW_LIMIT_PER_DAY', params);
  },
  setCommentLimitPerDay({ commit }, params) {
    commit('SET_COMMENT_LIMIT_PER_DAY', params);
  },
  setMutualFollowingTimeout({ commit }, params) {
    commit('SET_MUTUAL_FOLLOWING_TIMEOUT', params);
  },
  setUnfollowType({ commit }, params) {
    commit('SET_UNFOLLOW_TYPE', params);
  },
  setFollowerOrder({ commit }, params) {
    commit('SET_FOLLOWER_ORDER', params);
  },
  setLikePerFollower({ commit }, params) {
    commit('SET_LIKE_PER_FOLLOWER', params);
  },
  setCommentPerFollower({ commit }, params) {
    commit('SET_COMMENT_PER_FOLLOWER', params);
  },
  addCommentRule({ commit }, params) {
    commit('ADD_COMMENT_RULE', params);
  },
  removeCommentRule({ commit }, params) {
    commit('REMOVE_COMMENT_RULE', params);
  },
  addAutoComment({ commit }, params) {
    commit('ADD_AUTO_COMMENT', params);
  },
  removeAutoComment({ commit }, params) {
    commit('REMOVE_AUTO_COMMENT', params);
  },
  addAutoCommentComment({ commit }, params) {
    commit('ADD_AUTO_COMMENT_COMMENT', params);
  },
  removeAutoCommentComment({ commit }, params) {
    commit('REMOVE_AUTO_COMMENT_COMMENT', params);
  },
  addCommentRuleIncludeTag({ commit }, params) {
    commit('ADD_COMMENT_RULE_INCLUDE_TAG', params);
  },
  removeCommentRuleIncludeTag({ commit }, params) {
    commit('REMOVE_COMMENT_RULE_INCLUDE_TAG', params);
  },
  addCommentRuleExcludeTag({ commit }, params) {
    commit('ADD_COMMENT_RULE_EXCLUDE_TAG', params);
  },
  removeCommentRuleExcludeTag({ commit }, params) {
    commit('REMOVE_COMMENT_RULE_EXCLUDE_TAG', params);
  },
  addCommentRuleComment({ commit }, params) {
    commit('ADD_COMMENT_RULE_COMMENT', params);
  },
  removeCommentRuleComment({ commit }, params) {
    commit('REMOVE_COMMENT_RULE_COMMENT', params);
  },
  addDefaultComment({ commit }, params) {
    commit('ADD_DEFAULT_COMMENT', params);
  },
  removeDefaultComment({ commit }, params) {
    commit('REMOVE_DEFAULT_COMMENT', params);
  },
  setActiveTimes({ commit }, params) {
    commit('SET_ACTIVE_TIMES', params);
  },
  selectSetting({ commit }, params) {
    commit('SELECT_SETTING', params);
  },
  setFriends({ commit }, params) {
    const key = new Date().toLocaleDateString();
    const friends = [];
    params.followers.forEach((item) => {
      friends.push({ name: item, follower: true, following: false });
    });
    params.following.forEach((item) => {
      const friend = friends.filter(friend => friend.name === item)[0];
      if (friend) {
        friend.following = true;
      } else {
        friends.push({ name: item, follower: false, following: true });
      }
    });
    commit('SET_FRIENDS', {
      id: params.id,
      date: key,
      friends,
    });
  },
  clearFriends({ commit }) {
    commit('CLEAR_FRIENDS');
  },
  removeFriend({ commit }, params) {
    commit('REMOVE_FRIEND', params);
  },
  addInstagramLog({ commit }, log) {
    commit('ADD_INSTAGRAM_LOG', log);
  },
  plusInstagramLog({ commit }, params) {
    commit('PLUS_INSTAGRAM_LOG', params);
  },
  setTodayKey({ commit, state }) {
    const todayKey = new Date().toLocaleDateString();
    if (state.todayKey !== todayKey) {
      commit('SET_TODAY_KEY', todayKey);
    }
  },
  clearTodayKey({ commit }) {
    commit('CLEAR_TODAY_KEY');
  },
  clearAllInstagramLogs({ commit }) {
    commit('CLEAR_ALL_INSTAGRAM_LOGS');
  },
  setAccountLogs({ commit }, params) {
    commit('SET_ACCOUNT_LOGS', params);
  },
  setUnfollowProcess({ commit }, params) {
    commit('SET_UNFOLLOW_PROCESS', params);
  },
  addFollowBack({ commit }, params) {
    commit('ADD_FOLLOW_BACK', params);
  },
  setProfile({ commit }, params) {
    commit('SET_PROFILE', params);
  },
  followBackTrue({ commit }, params) {
    commit('FOLLOW_BACK_TRUE', params);
  },
  unfollowTrue({ commit }, params) {
    commit('UNFOLLOW_TRUE', params);
  },
  setAllLogs({ commit }, params) {
    commit('SET_ALL_LOGS', params);
  },
  setAccount({ commit }, params) {
    commit('SET_ACCOUNT', params);
  },
  removeAccount({ commit }, params) {
    commit('REMOVE_ACCOUNT', params);
  },
  clearAccount({ commit }) {
    commit('CLEAR_ACCOUT');
  },
  clearInstagramLogDetails({ commit }, params) {
    commit('CLEAR_INSTAGRAM_LOG_DETAILS', params);
  },
  loadAccountLogs({ commit }, params) {
    commit('LOAD_ACCOUNT_LOGS', params);
  },
  loadWorkLogs({ commit }, params) {
    commit('LOAD_WORK_LOGS', params);
  },
  saveInstagramWork({ commit }, params) {
    commit('SAVE_INSTAGRAM_WORK', params);
  },
  removeInstagramWork({ commit }, params) {
    commit('REMOVE_INSTAGRAM_WORK', params);
  },
  processingInstagramWork({ commit }, params) {
    commit('PROCESSING_INSTAGRAM_WORK', params);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
