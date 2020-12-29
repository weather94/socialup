const state = {
  version: '0.1.3',
  flagGetFriends: {
    loading: false,
    followersCount: 0,
    followers: [],
    followingCount: 0,
    following: [],
  },
  originDefaultSpamTag: [
    '토토사이트', '온라인카지노', '안전공원', '카지노사이트', '해외 안전', '메이저공원', '네임드', '도박', '바둑이', '픽스터', '단폴배팅', '무료픽',
    '파워볼', '사설토토', '바카라', '토토분석', '라이브스코어', '안전놀이터', '바카라사이트', '안전사이트', '온라인바카라',
    '최신게시물', '인기게시물', '도배상품', '국내당일배송', '최저마진', '비즈슈머', '마이셀즈', '애드펌킨',
    '쇼핑몰창업', '주부부업', '직장인투잡', '아지트샵', '인기게시물 상품', '팔로워 증가상품', '좋아요 증가상품',
    '클럽페이스', '아레나', '옥타곤', '메이드', '버닝썬', '매스', '클럽유레카', '마진거래', 'FX', '호빠', '호스트빠', '호스트바',
    '출장안마', '출장마사지', '출장아가씨', '콜걸', '원나잇', '룸싸롱', '성인놀이터', '신음소리', '상담환영',
    '유흥업소알바', '유흥주점알바', '단란주점알바', '노래방알바', '룸싸롱알바', '유흥알바', '룸알바', '강남쩜오', '소액', '대출', '롤링',
    '가슴성형', '강남일수', '강남고수익알바', '고수익알바', '지방이식', '눈성형', '텐카페', '자동차딜러',
    '룸싸롱', '룸살롱', '풀싸롱', '텐프로', '쩜오', '하드코어', '란제리룸', '조건만남', '섹스타그램', '오프녀',
  ],
  defaultSpamTag: [
    '토토사이트', '온라인카지노', '안전공원', '카지노사이트', '해외 안전', '메이저공원', '네임드', '도박', '바둑이', '픽스터', '단폴배팅', '무료픽',
    '파워볼', '사설토토', '바카라', '토토분석', '라이브스코어', '안전놀이터', '바카라사이트', '안전사이트', '온라인바카라',
    '최신게시물', '인기게시물', '도배상품', '국내당일배송', '최저마진', '비즈슈머', '마이셀즈', '애드펌킨',
    '쇼핑몰창업', '주부부업', '직장인투잡', '아지트샵', '인기게시물 상품', '팔로워 증가상품', '좋아요 증가상품',
    '클럽페이스', '아레나', '옥타곤', '메이드', '버닝썬', '매스', '클럽유레카', '마진거래', 'FX', '호빠', '호스트빠', '호스트바',
    '출장안마', '출장마사지', '출장아가씨', '콜걸', '원나잇', '룸싸롱', '성인놀이터', '신음소리', '상담환영',
    '유흥업소알바', '유흥주점알바', '단란주점알바', '노래방알바', '룸싸롱알바', '유흥알바', '룸알바', '강남쩜오', '소액', '대출', '롤링',
    '가슴성형', '강남일수', '강남고수익알바', '고수익알바', '지방이식', '눈성형', '텐카페', '자동차딜러',
    '룸싸롱', '룸살롱', '풀싸롱', '텐프로', '쩜오', '하드코어', '란제리룸', '조건만남', '섹스타그램', '오프녀',
  ],
  title: '상세기록',
};

// const getters = {
//   getAuth(state) {
//     return state.auth;
//   },
// };

const mutations = {
  START_GET_FRIENDS(state) {
    state.flagGetFriends.loading = true;
  },
  FINISH_GET_FRIENDS(state) {
    state.flagGetFriends = {
      loading: false,
      followersCount: 0,
      followers: [],
      followingCount: 0,
      following: [],
    };
  },
  PLUS_FOLLOWING_COUNT(state) {
    state.flagGetFriends.followingCount += 10;
  },
  PLUS_FOLLOWERS_COUNT(state) {
    state.flagGetFriends.followersCount += 10;
  },
  SET_FOLLOWERS(state, params) {
    state.flagGetFriends.followers = params;
  },
  SET_FOLLOWING(state, params) {
    state.flagGetFriends.following = params;
  },
  REMOVE_DEFAULT_SPAM_TAG(state, params) {
    state.defaultSpamTag = state.defaultSpamTag.filter(item => item !== params);
  },
  INIT_DEFAULT_SPAM_TAG(state) {
    state.defaultSpamTag = state.originDefaultSpamTag.slice();
  },
  CLEAR_DEFAULT_SPAM_TAG(state) {
    state.defaultSpamTag = [];
  },
  SET_VERSION(state, params) {
    state.version = params;
  },
  SET_TITLE(state, params) {
    state.title = params;
  },
};

const actions = {
  startGetFriends({ commit }) {
    commit('START_GET_FRIENDS');
  },
  finishGetFriends({ commit }) {
    commit('FINISH_GET_FRIENDS');
  },
  setFollowers({ commit }, params) {
    commit('SET_FOLLOWERS', params);
  },
  setFollowing({ commit }, params) {
    commit('SET_FOLLOWING', params);
  },
  plusFollowingCount({ commit }) {
    commit('PLUS_FOLLOWING_COUNT');
  },
  plusFollowersCount({ commit }) {
    commit('PLUS_FOLLOWERS_COUNT');
  },
  removeDefaultSpamTag({ commit }, params) {
    commit('REMOVE_DEFAULT_SPAM_TAG', params);
  },
  clearDefaultSpamTag({ commit }, params) {
    commit('CLEAR_DEFAULT_SPAM_TAG', params);
  },
  initDefaultSpamTag({ commit }) {
    commit('INIT_DEFAULT_SPAM_TAG');
  },
  setVersion({ commit }, params) {
    commit('SET_VERSION', params);
  },
  setTitle({ commit }, params) {
    commit('SET_TITLE', params);
  },
};

export default {
  state,
  // getters,
  mutations,
  actions,
};
