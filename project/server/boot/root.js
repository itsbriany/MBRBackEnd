module.exports = (server) => {
  // Install a `/` route that returns server status
  /* eslint-disable new-cap */
  const router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
