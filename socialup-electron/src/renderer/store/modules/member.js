const state = {
  member: null,
};

const mutations = {
  SET_MEMBER(state, data) {
    state.member = data;
  },
  CLEAR_MEMBER(state) {
    state.member = null;
  },
};

const actions = {
  setMember({ commit }, params) {
    commit('SET_MEMBER', params);
  },
  clearMember({ commit }) {
    commit('CLEAR_MEMBER');
  },
};

export default {
  state,
  mutations,
  actions,
};
