import * as _ from 'lodash';

const state = {
  version: '0.1.3',
  storage: {},
};

const mutations = {
  SET_VERSION(state, params) {
    state.version = params;
  },
  ADD_DATA(state, params) {
    state.storage[params.key] = params.value;
    state.storage = _.cloneDeep(state.storage);
  },
  REMOVE_DATA(state, params) {
    delete state.storage[params.key];
  },
};

const actions = {
  setVersion({ commit }, params) {
    commit('SET_VERSION', params);
  },
  addData({ commit }, params) {
    commit('ADD_DATA', params);
  },
  removeData({ commit }, params) {
    commit('REMOVE_DATA', params);
  },
};

export default {
  state,
  // getters,
  mutations,
  actions,
};
