import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Counts } from 'meteor/tmeasday:publish-counts';

Meteor.publish('users.data', function() {
    this.unblock();
    const currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find(currentUser);
    }
    return this.ready();
});

Meteor.publish('admin.users', function({ search, limit, orderBy, fields }) {
    this.unblock();
    // Meteor._sleepForMs 2000
    const currentUser = this.userId;
    if (currentUser && Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        const options = {
            sort: {},
            limit: Math.min(limit, 1000),
            fields
        };
        options.sort[orderBy.field] = orderBy.ordering;
        return Meteor.users.find(search, options);
    }
    return this.stop();
});

Meteor.publish('admin.users.counter', function({ search }) {
    this.unblock();
    const currentUser = this.userId;
    if (currentUser && Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        Counts.publish(this, 'admin.users.counter', Meteor.users.find(search));
    } else {
        this.stop();
    }
});

Meteor.publish('admin.usersDetail', function({ userId }) {
    this.unblock();
    const currentUser = this.userId;
    if (currentUser && Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        return Meteor.users.find(userId);
    }
    return this.stop();
});
