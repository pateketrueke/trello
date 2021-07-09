module.exports = ({ API }) => async function groupedCards(ctx) {
  const result = {
    groups: [],
    members: [],
  };

  if (ctx.session.profile) {
    const members = await API(ctx, `boards/${ctx.path_params.board_id}/members`);
    const cards = await API(ctx, `boards/${ctx.path_params.board_id}/cards`);
    const lists = await API(ctx, `boards/${ctx.path_params.board_id}/lists`, null, []);
    const groups = lists.reduce((memo, list) => {
      memo[list.id] = {
        id: list.id,
        name: list.name,
        activities: [],
      };
      return memo;
    }, {});

    cards.forEach(card => {
      groups[card.idList].activities.push({
        id: card.id,
        url: card.url,
        name: card.name,
        dueDate: card.due ? card.due.substr(0, 10) : '',
        members: card.idMembers,
        description: card.desc,
      });
    });

    result.groups = Object.values(groups);
    result.members = members.map(member => ({
      id: member.id,
      name: member.username,
      fullname: member.fullName,
    }));
  }

  ctx.resp_body = { result };
};
