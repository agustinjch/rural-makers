import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

function sendVerificationMail({ userId }) {
  const user = Meteor.users.findOne(userId, { fields: { emails: 1 } });

  if (!user) return false;

  if (!user || !user.emails || !user.emails.length || !user.emails[0].address) return false;

  if (user.emails[0].verified) return false;

  Accounts.sendVerificationEmail(user._id, user.emails[0].address);

  return true;
}

function updateProfile({ userId, params }) {
  const user = Meteor.users.findOne(userId, { fields: { credits: 1 } });

  if (!user) return { error: 'No existing user', result: null };

  const updatedProfile = { ...user.profile, ...params };

  Meteor.users.update(userId, { $set: { profile: updatedProfile } });
  return userId;
}

export default {
  sendVerificationMail,
  updateProfile
};
