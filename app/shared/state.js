import { readable, writable } from 'svelte/store';
import {
  apiCall, getLocal, setLocal,
} from './client';

export const loggedIn = writable(getLocal('api_token', false));
export const session = writable(getLocal('session', {}));

export function setToken(value) {
  history.replaceState(null, '', '/');
  setLocal('api_token', value);
  apiCall('session', { method: 'POST' })
    .then(result => {
      setLocal('session', result);
      session.set(result);
      loggedIn.set(true);
    });
}

export function clearToken() {
  apiCall('session', { method: 'DELETE' })
    .then(() => {
      setLocal('api_token', null);
      session.set({});
      loggedIn.set(false);
    });
}
