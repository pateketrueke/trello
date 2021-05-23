module.exports = ({ API }) => async function login(ctx) {
  const payload = await API(ctx, 'members/me');

  if (!payload.error) {
    ctx.put_session('profile', payload);
    this.userData(ctx);
  } else {
    ctx.resp_body = payload;
  }
};
