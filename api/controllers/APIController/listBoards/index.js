module.exports = ({ API }) => async function listBoards(ctx) {
  let result = [];
  if (ctx.session.profile) {
    result = await API(ctx, `organizations/${ctx.path_params.org_id}/boards`);
    result = result.map(board => ({
      id: board.id,
      url: board.url,
      name: board.name,
    }));
  }

  ctx.resp_body = { result };
};
