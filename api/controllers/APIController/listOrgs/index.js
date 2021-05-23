module.exports = ({ API }) => async function orgs(ctx) {
  let result = [];
  if (ctx.session.profile) {
    const data = ctx.session.profile;

    result = await API(ctx, `members/${data.id}/organizations`);
    result = result.map(org => ({
      id: org.id,
      logo: org.logoUrl,
      boards: org.idBoards,
      website: org.website,
      name: org.displayName,
      url: org.url,
    }));
  }

  ctx.resp_body = { result };
};
