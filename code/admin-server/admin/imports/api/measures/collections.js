import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';

export const Measures = new Mongo.Collection('measures');

Measures.schema = new SimpleSchema({
    counterId: {
        type: String,
        optional: false,
        label: 'User id'
    },
    data: {
        type: String,
        optional: true,
        label: 'Measure data taken from the counter absolute ( picture )'
    },
    bucket: { type: String, optional: true },
    path: { type: String, optional: true },
    url: { type: String, optional: true },
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

Measures.deny({
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

Measures.attachSchema(Measures.schema);
