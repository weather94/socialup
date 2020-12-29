const state = {
  auth: null,
};

const getters = {
  getAuth(state) {
    return state.auth;
  },
};

const mutations = {
  SET_AUTH(state, data) {
    state.auth = data;
  },
  CLEAR_AUTH(state) {
    state.auth = null;
  },
};

const actions = {
  setAuth({ commit }, params) {
    commit('SET_AUTH', params);
  },
  clearAuth({ commit }) {
    commit('CLEAR_AUTH');
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
