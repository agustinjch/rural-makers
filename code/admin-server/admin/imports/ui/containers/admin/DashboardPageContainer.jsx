import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import { Counts } from 'meteor/tmeasday:publish-counts';
import DashboardPage from '../../pages/DashboardPage';

const cards = ['counters'];

export default withTracker(({ currentUser }) => {
    const countersHandlers = Meteor.subscribe('admin.counters.counter', { search: {} });

    const loading = !countersHandlers.ready();

    const counters = [];
    _.each(cards, card => {
        const obj = {
            name: card,
            count: Counts.get(`admin.${card}.counter`)
        };
        counters.push(obj);
    });
    return {
        loading,
        counters,
        currentUser
    };
})(DashboardPage);
