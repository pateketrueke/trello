const Grown = require('grown')();
Grown.use(require('@grown/conn'));
Grown.use(require('@grown/router'));
Grown.use(require('./api/handlers'));

const app = new Grown();
app.listen(process.env.PORT || 3001);
app.plug([
  Grown.Router({
    routes: require('./api/routes'),
    controller_lookup: 'Handlers.%Controller',
  }),
  Grown.Conn,
]);
