module.exports = router => router()
  .namespace('/api/v1', api => api()
    .get('/me', { to: 'API.userData' })
    .get('/orgs', { to: 'API.listOrgs' })
    .get('/login', { to: 'API.authenticate' })
    .post('/session', { to: 'API.login' })
    .delete('/session', { to: 'API.logout' })
    .namespace('/boards', boards => boards()
      .get('/:org_id', { to: 'API.listBoards' })
      .post('/:org_id', { to: 'API.createBoard' })
      .delete('/:board_id', { to: 'API.removeBoard' }))
    .namespace('/cards', cards => cards()
      .get('/:board_id', { to: 'API.groupedCards' })
      .post('/:list_id', { to: 'API.createCard' })
      .put('/:card_id', { to: 'API.updateCard' })
      .delete('/:card_id', { to: 'API.removeCard' })));
