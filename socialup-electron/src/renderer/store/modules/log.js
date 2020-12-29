const state = {
  workLogs: {},
  todayKey: null,
};

const getters = {
  recentlyWorkLogs(state) {
    if (state.todayKey && state.workLogs[state.todayKey]) {
      return state.workLogs[state.todayKey].slice(-12).reverse();
    }
    return [];
  },
};

const mutations = {
  SET_WORK_LOGS(state, params) {
    state.workLogs = params;
  },
  ADD_WORK_LOG(state, obj) {
    const date = new Date();
    const time = date.toLocaleTimeString('en-GB');
    const dateKey = date.toLocaleDateString();
    if (!state.workLogs[dateKey]) {
      const workLogs = {};
      workLogs[dateKey] = [];
      state.workLogs = workLogs;
    }
    if (state.workLogs[dateKey].slice(-1)[0] && state.workLogs[dateKey].slice(-1)[0].type === obj.type && state.workLogs[dateKey].slice(-1)[0].state === obj.state
     && state.workLogs[dateKey].slice(-1)[0].text === obj.text && state.workLogs[dateKey].slice(-1)[0].tag === obj.tag) {
      const workLog = state.workLogs[dateKey].pop();
      workLog.count += 1;
      workLog.time = time;
      state.workLogs[dateKey].push(workLog);
    } else {
      obj.time = time;
      state.workLogs[dateKey].push(obj);
    }
  },
  CLEAR_WORK_LOG(state) {
    state.workLogs = {};
  },
  SET_WORK_TODAY_KEY(state, params) {
    state.todayKey = params;
  },
  CLEAR_WORK_TODAY_KEY(state) {
    state.todayKey = null;
  },
};

const actions = {
  setWorkLogs({ commit }, params) {
    commit('SET_WORK_LOGS', params);
  },
  addWorkLog({ commit }, log) {
    commit('ADD_WORK_LOG', log);
  },
  clearWorkLog({ commit }) {
    commit('CLEAR_WORK_LOG');
  },
  setWorkTodayKey({ commit, state }) {
    const todayKey = new Date().toLocaleDateString();
    if (state.todayKey !== todayKey) {
      commit('SET_WORK_TODAY_KEY', todayKey);
    }
  },
  clearWorkTodayKey({ commit }) {
    commit('CLEAR_WORK_TODAY_KEY');
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
