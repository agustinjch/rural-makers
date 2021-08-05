import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';

export const Settings = new Mongo.Collection('settings');

Settings.schema = new SimpleSchema({
    version: {
        type: Number,
        optional: false,
        label: 'Settings version number'
    },
    measureHourDifference: {
        type: String,
        optional: false,
        label: 'Every how many hours we do measures'
    },
    active: {
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

Settings.deny({
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

Settings.attachSchema(Settings.schema);
