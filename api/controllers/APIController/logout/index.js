module.exports = function logout(ctx) {
  ctx.delete_session('*');
  ctx.resp_body = { status: 'ok' };
};
