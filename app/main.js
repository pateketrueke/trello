import App from './components/App.svelte';
import { setToken } from './shared/state';

if (location.hash.includes('#token=')) {
  setToken(location.hash.split('#token=')[1]);
  history.replaceState(null, '', '/');
}

new App({ // eslint-disable-line
  target: document.querySelector('#app'),
});
