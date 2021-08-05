import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Measures } from '../collections';

Meteor.publish('admin.measures.counter', function({ search }) {
    const currentUser = this.userId;
    if (currentUser && Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        Counts.publish(this, 'admin.measures.counter', Measures.find(search));
    }
});

Meteor.publish('admin.measures.detail', function({ counterId }) {
    const currentUser = this.userId;
    if (Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        const options = {
            sort: { createdAt: -1 },
            limit: 365
        };
        // options.sort[orderBy.field] = orderBy.ordering;
        return Measures.find({ counterId, data: { $exists: true } }, options);
    }
    return this.stop();
});

Meteor.publish('admin.dataless.measures', function() {
    const currentUser = this.userId;
    if (Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        const options = {
            limit: 30
        };
        // options.sort[orderBy.field] = orderBy.ordering;
        return Measures.find({ data: { $exists: false } }, options);
    }
    return this.stop();
});
