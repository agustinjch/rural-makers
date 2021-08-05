import { Counters } from '../collections';
import { Measures } from '../../measures/collections';
import { Usages } from '../../usages/collections';
import { Meteor } from 'meteor/meteor';
import { createLocalData } from '../../../startup/server/localFixtures';

export function createDummyData({ removeOldData = true }) {
    const { deployMode } = Meteor.settings.public;

    if (deployMode === 'production') return;

    // We delete all data before creating new one.
    if (removeOldData) {
        const counters = Counters.find().fetch();

        counters.forEach(counter => {
            // remove measures
            Measures.remove({ counterId: counter.id });
            // remove usages
            Usages.remove({ counterId: counter.id });
            // remove counter
            Counters.remove(counter._id);
        });
    }

    if (deployMode === 'local' || deployMode === 'staging') {
        createLocalData();
    }
}
