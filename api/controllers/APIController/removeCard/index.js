// FIXME: send email-notification
module.exports = ({ API }) => async function removeCard(ctx) {
  await API(ctx, `cards/${ctx.path_params.card_id}`, { method: 'DELETE' });
  ctx.resp_body = { status: 'ok' };
};
