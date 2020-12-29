const state = {
  loginId: '',
  loginPw: '',
  username: '',
  cookie: null,
};

const mutations = {
  SET_ACCOUNT(state, data) {
    state.loginId = data.loginId;
    state.loginPw = data.loginPw;
    state.username = data.username;
    state.cookie = null;
  },
  SET_COOKIE(state, params) {
    state.cookie = params;
  },
};

const actions = {
  setAccount({ commit }, params) {
    commit('SET_ACCOUNT', params);
  },
  setCookie({ commit }, params) {
    commit('SET_COOKIE', params);
  },
};

export default {
  state,
  mutations,
  actions,
};
