const baseURL = 'https://trello.com';
const apiURL = 'https://api.trello.com';

async function api(ctx, route, options) {
  const token = ctx.req_headers['x-auth-token'];
  const opts = `key=${process.env.TRELLO_API_KEY}&token=${token}`;

  let data;
  try {
    data = await ctx.get_json(`${apiURL}/1/${route}/?${opts}`, options);
  } catch (e) {
    ctx.resp_body = e.stack;
  }
  return data;
}

module.exports = {
  async login(ctx) {
    const userdata = await api(ctx, 'members/me');

    ctx.put_session('profile', userdata);
    this.data(ctx);
  },
  logout(ctx) {
    ctx.delete_session('*');
    ctx.resp_body = { status: 'ok' };
  },
  async auth(ctx) {
    const permissions = process.env.TRELLO_API_PERMISSIONS || 'read,write';
    const expires = process.env.TRELLO_TOKEN_EXPIRATION || '1day';
    const app = process.env.TRELLO_APP_NAME || 'MyTrello';

    const opts = `expiration=${expires}&name=${app}&scope=${permissions}&response_type=token`;
    const url = `${baseURL}/1/authorize?${opts}&key=${process.env.TRELLO_API_KEY}&return_url=${process.env.BASE_URL || 'http://localhost:8080'}`;

    let html = await ctx.get_body(url);
    html = html.replace('<head>', `<head><base href="${baseURL}">`);

    ctx.resp_body = html;
  },
  async groupedCards(ctx) {
    let result = [];
    if (ctx.session.profile) {
      const cards = await api(ctx, `boards/${ctx.path_params.board_id}/cards`);
      const lists = await api(ctx, `boards/${ctx.path_params.board_id}/lists`);
      const groups = lists.reduce((memo, list) => {
        memo[list.id] = {
          id: list.id,
          name: list.name,
          closed: list.closed,
          activities: [],
        };
        return memo;
      }, {});

      cards.forEach(card => {
        groups[card.idList].activities.push({
          id: card.id,
          url: card.url,
          name: card.name,
          closed: card.closed,
          members: card.idMembers,
          subscribed: card.subscribed,
        });
      });

      result = Object.values(groups);
    }

    ctx.resp_body = { result };
  },
  async createCard(ctx) {
    const result = await api(ctx, 'cards', {
      method: 'POST',
      query: {
        name: ctx.body_params.name,
        idList: ctx.path_params.list_id,
      },
    });

    ctx.resp_body = { result };
  },
  async updateCard(ctx) {
    const result = await api(ctx, `cards/${ctx.path_params.card_id}`, {
      method: 'PUT',
      query: {
        name: ctx.body_params.name,
      },
    });

    ctx.resp_body = { result };
  },
  async removeCard(ctx) {
    await api(ctx, `cards/${ctx.path_params.card_id}`, { method: 'DELETE' });
    ctx.resp_body = { status: 'ok' };
  },
  async listBoards(ctx) {
    let result = [];
    if (ctx.session.profile) {
      result = await api(ctx, `organizations/${ctx.path_params.org_id}/boards`);
      result = result.map(board => ({
        id: board.id,
        url: board.url,
        name: board.name,
      }));
    }

    ctx.resp_body = { result };
  },
  async createBoard(ctx) {
    const result = await api(ctx, 'boards', {
      method: 'POST',
      query: {
        name: ctx.body_params.name,
        idOrganization: ctx.path_params.org_id,
      },
    });

    ctx.resp_body = { result };
  },
  async removeBoard(ctx) {
    await api(ctx, `boards/${ctx.path_params.board_id}`, { method: 'DELETE' });
    ctx.resp_body = { status: 'ok' };
  },
  async orgs(ctx) {
    let result = [];
    if (ctx.session.profile) {
      const data = ctx.session.profile;

      result = await api(ctx, `members/${data.id}/organizations`);
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
  },
  data(ctx) {
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
  },
};
