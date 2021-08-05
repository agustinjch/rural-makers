import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';

export const Counters = new Mongo.Collection('counters');

Counters.schema = new SimpleSchema({
    address: {
        type: String,
        optional: false,
        label: 'Counter address'
    },
    decimals: {
        type: Number,
        optional: false,
        label: 'Number of decimals in the counter'
    },
    id: {
        type: String,
        optional: false,
        label: 'Unique ID to identify the counter'
    },
    picture: {
        type: String,
        optional: true,
        label: 'Url to picture of the counter'
    },
    active: {
        type: Boolean,
        optional: false,
        defaultValue: true
    },
    hasRelative: {
        type: Boolean,
        optional: false,
        defaultValue: false
    },
    hasAbsolute: {
        type: Boolean,
        optional: false,
        defaultValue: true
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

Counters.deny({
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

Counters.attachSchema(Counters.schema);
