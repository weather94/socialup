const state = {
  postings: [],
  process: null,
  repeat: {
    images: [],
    hashtags: [],
    text: null,
    interval: 0,
  },
  logs: [],
};

const mutations = {
  ADD_POSTING(state, params) {
    state.postings.push(params);
  },
  REMOVE_POSTING(state, params) {
    state.postings = state.postings.filter(item => item !== params);
  },
  CLEAR_POSTING(state) {
    state.postings = [];
  },
  ADD_REPEAT_IMAGE(state, params) {
    state.repeat.images.push(params);
  },
  REMOVE_REPEAT_IMAGE(state, params) {
    state.repeat.images = state.repeat.images.filter(item => item !== params);
  },
  ADD_REPEAT_HASHTAG(state, params) {
    state.repeat.hashtags.push(params);
  },
  REMOVE_REPEAT_HASHTAG(state, params) {
    state.repeat.hashtags = state.repeat.hashtags.filter(item => item !== params);
  },
  SET_REPEAT_INTERVAL(state, params) {
    state.repeat.interval = params;
  },
  SET_REPEAT_TEXT(state, params) {
    state.repeat.text = params;
  },
  SET_POSTING_PROCESS(state, params) {
    state.process = params;
  },
  ADD_POSTING_LOG(state, params) {
    state.logs.push(params);
  },
  SET_POSTING_LOG(state, params) {
    state.logs = params;
  },
  CLEAR_POSTING_LOG(state) {
    state.logs = [];
  },
};

const actions = {
  addPosting({ commit }, params) {
    commit('ADD_POSTING', params);
  },
  removePosting({ commit }, params) {
    commit('REMOVE_POSTING', params);
  },
  clearPosting({ commit }) {
    commit('CLEAR_POSTING');
  },
  addRepeatImage({ commit }, params) {
    commit('ADD_REPEAT_IMAGE', params);
  },
  removeRepeatImage({ commit }, params) {
    commit('REMOVE_REPEAT_IMAGE', params);
  },
  addRepeatHashtag({ commit }, params) {
    commit('ADD_REPEAT_HASHTAG', params);
  },
  removeRepeatHashtag({ commit }, params) {
    commit('REMOVE_REPEAT_HASHTAG', params);
  },
  setRepeatInterval({ commit }, params) {
    commit('SET_REPEAT_INTERVAL', params);
  },
  setRepeatText({ commit }, params) {
    commit('SET_REPEAT_TEXT', params);
  },
  setPostingProcess({ commit }, params) {
    commit('SET_POSTING_PROCESS', params);
  },
  addPostingLog({ commit }, params) {
    commit('ADD_POSTING_LOG', params);
  },
  setPostingLog({ commit }, params) {
    commit('SET_POSTING_LOG', params);
  },
  clearPostingLog({ commit }) {
    commit('CLEAR_POSTING_LOG');
  },
};

export default {
  state,
  mutations,
  actions,
};
