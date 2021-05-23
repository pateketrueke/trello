module.exports = ({ API }) => async function createCard(ctx) {
  const result = await API(ctx, 'cards', {
    method: 'POST',
    query: {
      name: ctx.body_params.name,
      desc: ctx.body_params.description,
      due: ctx.body_params.dueDate,
      idList: ctx.path_params.list_id,
      idMembers: ctx.body_params.members.join(','),
    },
  });

  ctx.resp_body = { result };
};
