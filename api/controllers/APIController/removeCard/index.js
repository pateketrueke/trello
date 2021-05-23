module.exports = ({ API, sendMail }) => async function removeCard(ctx) {
  await API(ctx, `cards/${ctx.path_params.card_id}`, { method: 'DELETE' });
  ctx.resp_body = { status: 'ok' };

  const { task, list } = ctx.body_params;

  sendMail.taskDeleted({
    data: {
      OBJECT_TYPE: list,
      TASK_NAME: task.name,
      TASK_DESCRIPTION: task.description,
      USER_NAME: ctx.session.profile.fullName,
      DELETED_AT: new Date().toISOString().substr(0, 10),
    },
    email: process.env.TRELLO_EMAIL_RECIPIENT || 'john@doe.com',
    subject: 'A task was deleted from your board.',
  });
};
