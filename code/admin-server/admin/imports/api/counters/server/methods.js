import { Roles } from 'meteor/alanning:roles';
// import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import counterFunctions from './functions';

const createDummyDataMethod = new ValidatedMethod({
    name: 'counter.dummy.data',
    validate: new SimpleSchema({
        removeOldData: { type: Boolean, optional: true }
    }).validator(),
    run({ removeOldData }) {
        this.unblock();

        const { userId } = this;

        if (!userId) return { error: 'Not logged in user', result: null };
        if (!Roles.userIsInRole(userId, ['admin']))
            return { error: 'Not valid user', result: null };

        counterFunctions.createDummyData({ removeOldData });

        return { error: null, result: userId };
    }
});

export default { createDummyDataMethod };
