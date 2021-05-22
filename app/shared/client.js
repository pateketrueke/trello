export function setLocal(name, value) {
  if (value === null) {
    localStorage.removeItem(name);
  } else {
    localStorage.setItem(name, JSON.stringify(value));
  }
}

export function getLocal(name, fallback) {
  let result;
  try {
    result = JSON.parse(localStorage.getItem(name));
  } catch (e) {
    // this is fine
  }

  return result === null || typeof result === 'undefined' ? fallback : result;
}

export function apiCall(uri, options = {}) {
  const token = getLocal('api_token');

  return fetch(`/api/${uri}`, {
    headers: {
      ...options.headers,
      'x-auth-token': token,
      'content-type': 'application/json',
    },
    ...options,
  }).then(resp => resp.json())
  .catch(e => {
    throw new Error(`Failed to call /${uri}`);
  });
}
