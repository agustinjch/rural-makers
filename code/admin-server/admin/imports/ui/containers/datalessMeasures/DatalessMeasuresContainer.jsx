import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Measures } from '../../../api/measures/collections';

import DatalessMeasuresPage from '../../pages/datalessMeasures/DatalessMeasuresPage';

export default withTracker(() => {
    const measuresHandle = Meteor.subscribe('admin.dataless.measures');
    const loading = !measuresHandle.ready();

    const measures = !loading ? Measures.find({}, { sort: { createdAt: 1 } }).fetch() : [];

    return {
        loading,
        measures
    };
})(DatalessMeasuresPage);
