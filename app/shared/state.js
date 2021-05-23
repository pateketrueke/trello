import { readable, writable } from 'svelte/store';
import {
  apiCall, getLocal, setLocal,
} from './utils';

export const loggedIn = writable(getLocal('api_token', false));
export const session = writable(getLocal('user_session', {}));

export function setToken(value) {
  setLocal('api_token', value);
  apiCall('session', { method: 'POST' })
    .then(({ error, result }) => {
      setLocal('user_session', result);
      session.set(result);
      loggedIn.set(!error);
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
