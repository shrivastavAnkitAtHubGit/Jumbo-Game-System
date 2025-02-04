// setup all routes
const restana = require('restana')();

const router = restana.newRouter();

require('../modules/health/routes/health.routes')(router);
require('../modules/user/routes/user.routes')(router);
// require('../modules/game/routes/game.routes')(router);
// require('../modules/question/routes/question.routes')(router);
// require('../modules/session/routes/session.routes')(router);

module.exports = router;
