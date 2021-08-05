import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Divider, Header } from 'semantic-ui-react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import PropTypes from 'prop-types';
import PageHeader from '../../components/admin/PageHeader';
import CounterDetailHeader from '../../components/counters/CounterDetailHeader';

import { _ } from 'meteor/underscore';
import moment from 'moment';

import Loading from '../../components/utils/Loading';
import LineChart from '../../components/charts/LineChart.jsx';

export default class UsersDetailPage extends React.Component {
    constructor(props) {
        super(props);
        // this.removeBan = this.removeBan.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const routeParam = FlowRouter.getParam('tab');
        return { activeItem: routeParam || 'info', userOwner: null };
    }

    _prepareUsageStats({ usages }) {
        let labels = [];
        let values = [];
        _.each(usages, day => {
            let tempDate = moment(day.date).format('YYYY-MM-DD');
            labels.push(tempDate);
            let value = day;

            values.push(value.liters);
        });
        values.reverse();
        labels.reverse();
        return { values, labels };
    }
    _prepareMeasureStats({ measures }) {
        let labels = [];
        let values = [];
        _.each(measures, day => {
            let tempDate = moment(day.date).format('YYYY-MM-DD');
            labels.push(tempDate);
            let value = day;

            values.push(value.data);
        });
        values.reverse();
        labels.reverse();
        return { values, labels };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps != this.props) {
            const { usages, measures } = nextProps;
            this._prepareUsageStats({ usages });
            this._prepareMeasureStats({ measures });
        }
    }

    render() {
        const { counter, loading, counterId, measures, usages } = this.props;
        console.log('props', this.props);

        if (loading) {
            return (
                <div>
                    <PageHeader
                        title="Counters"
                        subTitle={counter !== null ? counter.address : counterId}
                    />
                    <section className="content">
                        <Loading />
                    </section>
                </div>
            );
        }

        // prepare charts
        const usageStats = this._prepareUsageStats({ usages });
        const measureStats = this._prepareMeasureStats({ measures });

        return (
            <div>
                <PageHeader title="Counters" subTitle={counter?.address || counterId} />
                <section className="content">
                    <div>
                        <CounterDetailHeader counter={counter} />
                        <Divider />
                        <Header as="h2">Usage per day</Header>
                        <Divider />
                        <LineChart
                            data={usageStats.values}
                            labels={usageStats.labels}
                            color={'#21ba45'}
                            title={'TEst 1'}
                            name={`Test 2`}
                        />
                        <Divider />
                        <Header as="h2">Total usage of the counter</Header>
                        <Divider />
                        <LineChart
                            data={measureStats.values}
                            labels={measureStats.labels}
                            color={'#2185d0'}
                            title={'TEst1'}
                            name={`Test 2`}
                        />
                    </div>
                </section>
            </div>
        );
    }
}

UsersDetailPage.defaultProps = {
    loading: true,
    counterId: null,
    measures: [],
    usages: [],
    counter: null
};

UsersDetailPage.propTypes = {
    loading: PropTypes.bool,
    counterId: PropTypes.string,
    measures: PropTypes.array,
    usages: PropTypes.array,
    counter: PropTypes.shape({})
};
