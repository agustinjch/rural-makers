import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
// import { Counts } from 'meteor/tmeasday:publish-counts';
import { Usages } from '../collections';

Meteor.publish('admin.usages.detail', function({ counterId }) {
    const currentUser = this.userId;
    if (Roles.userIsInRole(currentUser, ['admin', 'staff'])) {
        const options = {
            sort: { createdAt: -1 },
            limit: 365
        };
        // options.sort[orderBy.field] = orderBy.ordering;
        return Usages.find({ counterId }, options);
    }
    return this.stop();
});
