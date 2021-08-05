import { Meteor } from 'meteor/meteor';
import os from 'os';
import logger from 'winston';
import { Papertrail } from 'winston-papertrail';

const { deployMode } = Meteor.settings.public;
const { appType } = Meteor.settings;

export default logger;
logger.exitOnError = false;
logger.remove(logger.transports.Console);

// CONSOLE
const consoleOptions = {
  level: 'debug',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  prettyPrint: true,
  debugStdout: true
};
consoleOptions.colorize = deployMode === 'local';

logger.add(logger.transports.Console, consoleOptions);

// only log to papertrail and mail if not on localhost
if (deployMode !== 'local') {
  // PAPERTRAIL
  let hostname;
  switch (deployMode) {
    case 'production':
      hostname = `lp-prod-${appType}`;
      break;
    case 'staging':
      hostname = `lp-dev-${appType}`;
      break;
    default:
      hostname = `lp-${deployMode}-${os.hostname()}`;
  }

  logger.add(Papertrail, {
    level: 'debug',
    host: 'logs2.papertrailapp.com',
    port: 41956,
    program: 'lp',
    hostname,
    logFormat(level, message) {
      return `[${level}] ${message}`;
    },
    inlineMeta: true,
    colorize: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  });
}
