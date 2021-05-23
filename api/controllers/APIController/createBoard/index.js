module.exports = ({ API }) => async function createBoard(ctx) {
  const result = await API(ctx, 'boards', {
    method: 'POST',
    query: {
      name: ctx.body_params.name,
      idOrganization: ctx.path_params.org_id,
    },
  });

  ctx.resp_body = { result };
};
