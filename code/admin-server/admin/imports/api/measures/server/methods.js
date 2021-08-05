import { Roles } from 'meteor/alanning:roles';
// import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import measureFunctions from './functions';

const removeDatalessMeasure = new ValidatedMethod({
    name: 'remove.dataless.measure',
    validate: new SimpleSchema({
        measureId: { type: String, optional: false }
    }).validator(),
    run({ measureId }) {
        this.unblock();

        const { userId } = this;

        if (!userId) return { error: 'Not logged in user', result: null };
        if (!Roles.userIsInRole(userId, ['admin']))
            return { error: 'Not valid user', result: null };

        measureFunctions.removeDataless({ measureId });

        return { error: null, result: userId };
    }
});

const addDataToDatalessMeasure = new ValidatedMethod({
    name: 'add.dataless.measure',
    validate: new SimpleSchema({
        measureId: { type: String, optional: false },
        data: { type: String, optional: false }
    }).validator(),
    run({ measureId, data }) {
        this.unblock();

        const { userId } = this;

        if (isNaN(parseFloat(data))) return { error: 'No valid data', result: null };

        if (!userId) return { error: 'Not logged in user', result: null };
        if (!Roles.userIsInRole(userId, ['admin']))
            return { error: 'Not valid user', result: null };

        measureFunctions.addDataToDataless({ measureId, data });

        return { error: null, result: userId };
    }
});

export default { removeDatalessMeasure, addDataToDatalessMeasure };
