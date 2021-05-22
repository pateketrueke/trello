module.exports = router => router()
  .namespace('/api/v1', api => api()
    .get('/me', { to: 'API.data' })
    .get('/orgs', { to: 'API.orgs' })
    .get('/login', { to: 'API.auth' })
    .post('/session', { to: 'API.token' })
    .delete('/session', { to: 'API.clear' }));
