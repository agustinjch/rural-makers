import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

Meteor.users.schema = new SimpleSchema({
  emails: {
    type: Array,
    optional: true
  },
  'emails.$': {
    type: Object
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  'emails.$.verified': {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Array,
    optional: true
  },
  'roles.$': {
    type: String,
    optional: true
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(Meteor.users.schema);

Meteor.users.publicFields = {
  createdAt: 1,
  profile: 1,
  emails: 1
};

// Deny all client-side updates to user documents
Meteor.users.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  }
});

Meteor.users.allow({
  insert() {
    return false;
  },
  update(userId, doc) {
    return userId && userId === doc._id;
  },
  remove() {
    return false;
  }
});
