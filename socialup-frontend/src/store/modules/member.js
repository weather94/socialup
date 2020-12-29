const state = {
  member: null
}

const getters = {
  getMember(state) {
    return state.member;
  },
}

const mutations = {
  SET_MEMBER(state, data) {
    state.member = data;
  },
  CLEAR_MEMBER(state) {
    state.member = null;
  },
  ADD_INSTAGRAM_PROXY(state, params) {
    if (state.member.periodProxys.instagramProxy) {
      state.member.periodProxys.instagramProxy.instagramProxys.push(params);
    }
  },
  REMOVE_INSTAGRAM_PROXY(state, params) {
    if (state.member.periodProxys.instagramProxy) {
      state.member.periodProxys.instagramProxy.instagramProxys = state.member.periodProxys.instagramProxy.instagramProxys.filter(item => item.id !== params);
    }
  },
  START_INSTAGRAM_PROXY(state, params) {
    if (state.member.periodProxys.instagramProxy) {
      const instagramProxy = state.member.periodProxys.instagramProxy.instagramProxys.filter(item => item.id === params);
      instagramProxy[0].start = true;
    }
  },
  STOP_INSTAGRAM_PROXY(state, params) {
    if (state.member.periodProxys.instagramProxy) {
      const instagramProxy = state.member.periodProxys.instagramProxy.instagramProxys.filter(item => item.id === params)[0];
      instagramProxy.start = false;
    }
  },
  UPDATE_PROXY_INSTAGRAM_OPTION(state, params) {
    const instagramProxy = state.member.periodProxys.instagramProxy.instagramProxys.filter(item => item.instagramOption.id === params.beforeId)[0];
    instagramProxy.instagramOption = params.option;
  }
}

const actions = {
  setMember({ commit }, params){
    commit('SET_MEMBER', params);
  },
  clearMember({ commit }){
    commit('CLEAR_MEMBER');
  },
  addInstagramProxy({ commit }, params){
    commit('ADD_INSTAGRAM_PROXY', params);
  },
  removeInstagramProxy({ commit }, params){
    commit('REMOVE_INSTAGRAM_PROXY', params);
  },
  startInstagramProxy({ commit }, params){
    commit('START_INSTAGRAM_PROXY', params);
  },
  stopInstagramProxy({ commit }, params){
    commit('STOP_INSTAGRAM_PROXY', params);
  },
  updateProxyInstagramOption({ commit }, params){
    commit('UPDATE_PROXY_INSTAGRAM_OPTION', params);
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
};
