import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

Factory.define('user', Meteor.users, {
  createdAt: () => new Date(),
  roles: ['free']
});
