import axios from 'axios';
import store from '@/store';

const makeAxios = function makeAxios() {
  // const baseURL = 'http://localhost:8080';
  const baseURL = 'http://socialup.kr';
  let auth = localStorage.getItem('auth');
  let instance = null;

  if (auth) {
    auth = JSON.parse(auth);
    store.dispatch('setAuth', auth);
    instance = axios.create({
      baseURL,
      // headers: { Authorization: `Bearer ${auth.access.token}` },
    });
  } else {
    instance = axios.create({
      baseURL,
    });
  }

  instance.interceptors.response.use(
    response => response,
    (error) => {
      const originalRequest = error.config;
      if (error.code !== 'ECONNABORTED' && error.response.status === 401) {
        if (!originalRequest.retry) {
          originalRequest.retry = true;
          return axios.post('api/auth/refresh', {
              token: store.state.auth.auth.refresh.token,
            }, {
              baseURL,
            }).then((response) => {
              const auth = JSON.parse(localStorage.getItem('auth'));
              auth.access = response.data;
              localStorage.setItem('auth', JSON.stringify(auth));
              store.dispatch('setAuth', auth);
              // instance.defaults.headers.Authorization = `Bearer ${auth.access.token}`;
              // originalRequest.headers.Authorization = `Bearer ${auth.access.token}`;
              return instance(originalRequest);
            });
        }
        localStorage.removeItem('auth');
        store.dispatch('clearAuth');
      }
      return Promise.reject(error);
    },
  );
  return instance;
};
export default makeAxios;
