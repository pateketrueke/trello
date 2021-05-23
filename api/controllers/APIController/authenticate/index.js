module.exports = ({ API, baseURL }) => async function auth(ctx) {
  const permissions = process.env.TRELLO_API_PERMISSIONS || 'read,write';
  const expires = process.env.TRELLO_TOKEN_EXPIRATION || '1day';
  const app = process.env.TRELLO_APP_NAME || 'MyTrello';

  const opts = `expiration=${expires}&name=${app}&scope=${permissions}&response_type=token`;
  const url = `${baseURL}/1/authorize?${opts}&key=${process.env.TRELLO_API_KEY}&return_url=${process.env.BASE_URL || 'http://localhost:8080'}`;

  let html = await ctx.get_body(url);
  html = html.replace('<head>', `<head><base href="${baseURL}">`);

  ctx.resp_body = html;
};
