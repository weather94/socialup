const state = {};

const mutations = {
  SET_SETTING_NAME(state, params) {
    state[params.id].settingName = params.settingName;
  },
  SET_PROXY(state, params) {
    state[params.id].proxy = params.proxy;
  },
  SET_PROXY_ADDRESS(state, params) {
    state[params.id].proxyAddress = params.proxyAddress;
  },
  SET_VIEW_BROWSER(state, params) {
    state[params.id].viewBrowser = params.viewBrowser;
  },
  SET_MULTI_PROCESS(state, params) {
    state[params.id].process = params.process;
  },
  SET_MULTI_TOKEN(state, params) {
    state[params.id].token = params.token;
  },
  CREATE_PROCESS(state, params) {
    state[params] = {
      settingName: null,
      proxy: false,
      proxyAddress: null,
      viewBrowser: false,
      process: false,
      token: 0,
    };
  },
};

const actions = {
  setSettingName({ commit }, params) {
    commit('SET_SETTING_NAME', params);
  },
  setProxy({ commit }, params) {
    commit('SET_PROXY', params);
  },
  setProxyAddress({ commit }, params) {
    commit('SET_PROXY_ADDRESS', params);
  },
  setViewBrowser({ commit }, params) {
    commit('SET_VIEW_BROWSER', params);
  },
  setMultiProcess({ commit }, params) {
    commit('SET_MULTI_PROCESS', params);
  },
  setMultiToken({ commit }, params) {
    commit('SET_MULTI_TOKEN', params);
  },
  createProcess({ commit }, params) {
    commit('CREATE_PROCESS', params);
  },
};

export default {
  state,
  mutations,
  actions,
};
