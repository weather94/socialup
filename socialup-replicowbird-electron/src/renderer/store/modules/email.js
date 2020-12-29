// import * as _ from 'lodash';
// import { Object } from 'core-js';

const state = {
  accounts: [],
  id: 0,
};

const mutations = {
  SET_EMAIL_ID(state, params) {
    state.id = params;
  },
  SET_EMAILS(state, params) {
    state.accounts = params;
  },
  ADD_EMAIL(state, params) {
    state.accounts = state.accounts.concat({
      id: state.id,
      ...params,
    });
    state.id += 1;
  },
  REMOVE_EMAIL(state, params) {
    state.accounts = state.accounts.filter(item => item.id !== params.id);
  },
  UPDATE_EMAIL(state, params) {
    let item = state.accounts.filter(item => item.id === params.id)[0];
    if (item) {
      item = {
        ...item,
        ...params,
      };
      state.accounts = state.accounts.filter(item => item.id !== params.id).concat(item);
    }
  },
};

const actions = {
  setEmails({ commit }, params) {
    commit('SET_EMAILS', params);
  },
  addEmail({ commit }, params) {
    commit('ADD_EMAIL', params);
  },
  removeEmail({ commit }, params) {
    commit('REMOVE_EMAIL', params);
  },
  updateEmail({ commit }, params) {
    commit('UPDATE_EMAIL', params);
  },
  setEmailId({ commit }, params) {
    commit('SET_EMAIL_ID', params);
  },
};

export default {
  state,
  // getters,
  mutations,
  actions,
};
