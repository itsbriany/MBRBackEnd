const crypto = require('crypto');
const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ timestamp: true }),
  ],
});

module.exports = (MortgageApplication) => {
  const secret = 'supersecret';
  const hmac = crypto.createHmac('sha256', secret);

  // Remote hooks to trigger functionality just before or after the HTTP request
  MortgageApplication.beforeRemote('create', (ctx, unused, next) => {
    const dataToHash = JSON.stringify(ctx.args);
    ctx.args.data.mortgageID = hmac.update(dataToHash).digest('hex');
    logger.log('info', `Creating a new mortgage application: ${JSON.stringify(ctx.args)}`);
    next();
  });

  // Send back the Mortgage ID
  MortgageApplication.afterRemote('create', (ctx, next) => {
    next(ctx.args.data.mortgageID);
  });

  // Error handling
  MortgageApplication.afterRemoteError('create', (ctx, next) => {
    logger.log('error', ctx.error.message);
    next(new Error('The mortgage application already exists'));
  });

};
