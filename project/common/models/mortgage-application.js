const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ timestamp: true }),
  ],
});

module.exports = (MortgageApplication) => {
  // Remote hooks to trigger functionality just before or after the HTTP request
  MortgageApplication.beforeRemote('create', (ctx, unused, next) => {
    logger.log('info', `Creating a new mortgage application: ${JSON.stringify(ctx.args)}`);
    next();
  });

  MortgageApplication.beforeRemote('find', (ctx, unused, next) => {
    logger.log('info', 'Request to find mortgage applications...');
    next();
  });

  // Send back the Mortgage ID
  // MortgageApplication.afterRemote('create', (ctx, next) => {
  //   next(ctx.args.data.mortgageID);
  // });

  // Error handling
  MortgageApplication.afterRemoteError('create', (ctx, next) => {
    logger.log('error', ctx.error.message);
    next(new Error('The mortgage application already exists'));
  });

  MortgageApplication.afterRemoteError('find', (ctx, next) => {
    logger.log('error', ctx.error.message);
    next(ctx.error);
  });

};
