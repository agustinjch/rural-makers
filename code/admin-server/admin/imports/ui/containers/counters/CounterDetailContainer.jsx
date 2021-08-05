import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Counters } from '../../../api/counters/collections';
import { Measures } from '../../../api/measures/collections';
import { Usages } from '../../../api/usages/collections';

import CounterDetailPage from '../../pages/counters/CounterDetailPage';

export default withTracker(() => {
    const counterId = FlowRouter.getParam('counterId');
    const counterHandle = Meteor.subscribe('admin.counter.detail', { counterId });
    const usagesHandle = Meteor.subscribe('admin.usages.detail', { counterId });
    const measuresHandle = Meteor.subscribe('admin.measures.detail', { counterId });
    const loading = !counterHandle.ready() || !usagesHandle.ready() || !measuresHandle.ready();

    const counter = !loading ? Counters.findOne({ id: counterId }) : null;
    const measures = !loading
        ? Measures.find({ counterId }, { sort: { createdAt: -1 } }).fetch()
        : [];
    const usages = !loading ? Usages.find({ counterId }, { sort: { createdAt: -1 } }).fetch() : [];

    return {
        loading,
        counter,
        counterId,
        usages,
        measures
    };
})(CounterDetailPage);
