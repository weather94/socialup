import axios from 'axios'

const state = {
  reviews: []
}

const mutations = {
  SET_REVIEWS(state, data) {
    state.reviews = data;
  },
  ADD_REVIEWS(state, data) {
    state.reviews = state.reviews.concat(data);
  },
  ADD_FRONT_REVIEWS(state, data) {
    let reviews = [data];
    state.reviews = reviews.concat(state.reviews);
  },
  CLEAR_REVIEWS(state) {
    state.reviews = [];
  },
}

const actions = {
  setReviews({ commit }, params){
    commit('SET_REVIEWS', params);
  },
  addReviews({ commit }, params) {
    commit('ADD_REVIEWS', params);
  },
  addFrontReviews({ commit }, params) {
    commit('ADD_FRONT_REVIEWS', params);
  },
  clearReviews({ commit }){
    commit('CLEAR_REVIEWS');
  },
}

export default {
  state,
  mutations,
  actions,
};
