const baseURL = 'https://trello.com';
const apiURL = 'https://api.trello.com';

async function api(ctx, route, options) {
  const token = ctx.req_headers['x-auth-token'];
  const opts = `key=${process.env.TRELLO_API_KEY}&token=${token}`;

  let data;
  try {
    data = await ctx.get_json(`${apiURL}/1/${route}/?${opts}`, options);
  } catch (e) {
    ctx.resp_body = e.stack;
  }
  return data;
}

module.exports = {
  baseURL() {
    return baseURL;
  },
  getAPI() {
    return api;
  },
};
