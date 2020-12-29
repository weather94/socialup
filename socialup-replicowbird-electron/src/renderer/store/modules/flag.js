import * as _ from 'lodash';

const state = {
  version: '0.1.3',
  storage: {},
  shoesCount: 0,
  shoesList: [],
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
  SET_SHOES_COUNT(state, params) {
    state.shoesCount = params;
  },
  PLUS_SHOES_COUNT(state) {
    state.shoesCount += 1;
  },
  SET_SHOES_LIST(state, params) {
    state.shoesList = params;
  },
  CLEAR_SHOES_LIST(state) {
    state.shoesList = [];
  },
};

const actions = {
  setVersion({ commit }, params) {
    commit('SET_VERSION', params);
  },
  setShoesCount({ commit }, params) {
    commit('SET_SHOES_COUNT', params);
  },
  plusShoesCount({ commit }) {
    commit('PLUS_SHOES_COUNT');
  },
  setShoesList({ commit }, params) {
    commit('SET_SHOES_LIST', params);
  },
  clearShoesList({ commit }) {
    commit('CLEAR_SHOES_LIST');
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
