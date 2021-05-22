module.exports = router => router()
  .get('/api/*any?', { to: 'API.v1' });
