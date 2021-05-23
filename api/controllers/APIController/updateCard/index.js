module.exports = ({ API }) => async function updateCard(ctx) {
  const result = await API(ctx, `cards/${ctx.path_params.card_id}`, {
    method: 'PUT',
    query: {
      name: ctx.body_params.name,
      desc: ctx.body_params.description,
      due: ctx.body_params.dueDate,
      idMembers: ctx.body_params.members.join(','),
    },
  });

  ctx.resp_body = { result };
};
