const state = {
  accounts: [],
  workKG: [],
};

const mutations = {
  SET_GHOST_ACCOUNTS(state, params) {
    state.accounts = params;
  },
  ADD_GHOST_ACCOUNTS(state, params) {
    state.accounts = [params].concat(state.accounts);
  },
  REMOVE_GHOST_ACCOUNT(state, params) {
    state.accounts = state.accounts.filter(item => item.id !== params.id);
  },
  SET_INSTAGRAM_WORK_KG(state, params) {
    params.forEach((item) => {
      const work = state.workKG.filter(work => item.id === work.id)[0];
      if (work && work.process) {
        item.process = work.process;
      }
    });
    state.workKG = params;
  },
  PROCESSING_INSTAGRAM_WORK_KG(state, params) {
    const work = state.workKG.filter(item => item.id === params.workId)[0];
    if (work) {
      if (!work.process) {
        work.process = [];
      }
      work.process.push(params.accountId);
    }
  },
  REMOVE_INSTAGRAM_WORK_KG(state, params) {
    state.workKG = state.workKG.filter(item => item.id !== params.id);
  },
};

const actions = {
  setGhostAccounts({ commit }, params) {
    commit('SET_GHOST_ACCOUNTS', params);
  },
  addGhostAccounts({ commit }, params) {
    commit('ADD_GHOST_ACCOUNTS', params);
  },
  removeGhostAccount({ commit }, params) {
    commit('REMOVE_GHOST_ACCOUNT', params);
  },
  setInstagramWorkKG({ commit }, params) {
    commit('SET_INSTAGRAM_WORK_KG', params);
  },
  removeInstagramWorkKG({ commit }, params) {
    commit('REMOVE_INSTAGRAM_WORK_KG', params);
  },
  processingInstagramWorkKG({ commit }, params) {
    commit('PROCESSING_INSTAGRAM_WORK_KG', params);
  },
};

export default {
  state,
  mutations,
  actions,
};
