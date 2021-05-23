module.exports = ({ API }) => async function removeBoard(ctx) {
  await API(ctx, `boards/${ctx.path_params.board_id}`, { method: 'DELETE' });
  ctx.resp_body = { status: 'ok' };
};
