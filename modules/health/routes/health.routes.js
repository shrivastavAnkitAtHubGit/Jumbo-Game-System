const {
    healthCheck,
    authHealthCheck,
} = require('../controllers/health.controller');

module.exports = (router) => {
    router.all('/health', healthCheck);
    router.all('/auth/health', authHealthCheck);
};
  