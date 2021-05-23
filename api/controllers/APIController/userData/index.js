module.exports = function userData(ctx) {
  let result = null;
  if (ctx.session.profile) {
    const data = ctx.session.profile;

    result = {
      orgs: data.idOrganizations,
      boards: data.idBoards,
      avatar: data.avatarUrl,
      username: data.userName,
      fullname: data.fullName,
      profile_url: data.url,
    };
  }

  ctx.resp_body = { result };
};
