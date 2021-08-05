import { Meteor } from 'meteor/meteor';
import { Settings } from '../collections';

Meteor.publish('settings', function() {
    this.unblock();
    const currentUser = this.userId;

    if (!currentUser) return this.stop();

    const list = Settings.find({ active: true });

    return list;
});
