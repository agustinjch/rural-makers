import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import userFunctions from './functions';

const updateProfile = new ValidatedMethod({
  name: 'user.updateProfile',
  validate: new SimpleSchema({
    name: { type: String, optional: true },
    location: { type: String, optional: true },
    bio: { type: String, optional: true }
  }).validator(),
  run({ name, location, bio }) {
    this.unblock();

    const { userId } = this;

    if (!userId) return { error: 'Not logged in user', result: null };

    const params = {
      name,
      location,
      bio
    };

    userFunctions.updateProfile({ userId, params });

    return { error: null, result: userId };
  }
});

export default { updateProfile };
