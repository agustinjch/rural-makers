import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';

export const Usages = new Mongo.Collection('usages');

Usages.schema = new SimpleSchema({
    counterId: {
        type: String,
        optional: false,
        label: 'Counter id'
    },
    liters: {
        type: String,
        optional: false,
        label: 'Liters used on a given day ( 0 - 1 )'
    },
    date: {
        type: Date,
        optional: false
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return new Date();
            }
            if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            }
            return this.unset();
        }
    }
});

Usages.deny({
    insert() {
        return true;
    },
    update(userId) {
        return !Roles.userIsInRole(userId, ['admin', 'staff']);
    },
    remove() {
        return true;
    }
});

Usages.attachSchema(Usages.schema);
