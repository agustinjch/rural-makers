import { Meteor } from 'meteor/meteor';
import logger from '../../logger';

Meteor.publish('users.account', function() {
  logger.info(`called userPublications by user: ${this.userId}`);

  this.unblock();
  const currentUser = this.userId;
  if (currentUser) {
    return Meteor.users.find(currentUser);
  }
  return this.ready();
});

Meteor.users.deny({ update: () => true });
