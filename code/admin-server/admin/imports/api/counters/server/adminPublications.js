import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Counters } from '../collections';

Meteor.publish('admin.counters.counter', function({ search }) {
    const currentUser = this.userId;
    if (currentUser && Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        Counts.publish(this, 'admin.counters.counter', Counters.find(search));
    }
});

Meteor.publish('admin.counters', function({ search, limit, orderBy, fields }) {
    const currentUser = this.userId;
    if (Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        const options = {
            sort: {},
            limit: Math.min(limit, 1000),
            fields
        };
        options.sort[orderBy.field] = orderBy.ordering;
        return Counters.find(search, options);
    }
    return this.stop();
});

Meteor.publish('admin.counter.detail', function({ counterId }) {
    const currentUser = this.userId;
    if (Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        return Counters.find({ id: counterId });
    }
    return this.stop();
});
