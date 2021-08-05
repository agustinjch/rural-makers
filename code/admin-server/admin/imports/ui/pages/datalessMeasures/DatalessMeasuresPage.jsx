import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Divider, Card, Button, Input, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PageHeader from '../../components/admin/PageHeader';
import MeasureCard from '../../components/measures/MeasureCard';

import Loading from '../../components/utils/Loading';

export default class DatalessMeasuresPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loading, measures } = this.props;
        console.log('props', this.props);

        if (loading) {
            return (
                <div>
                    <PageHeader title="Measures with no data" />
                    <section className="content">
                        <Loading />
                    </section>
                </div>
            );
        }

        return (
            <div>
                <PageHeader title="Measures to do" />
                <section className="content">
                    <div>
                        <Card.Group itemsPerRow="4">
                            {measures.map(measure => (
                                <MeasureCard key={measure._id} measure={measure} />
                            ))}
                        </Card.Group>
                        <Divider />
                    </div>
                </section>
            </div>
        );
    }
}

DatalessMeasuresPage.defaultProps = {
    loading: true,
    measures: []
};

DatalessMeasuresPage.propTypes = {
    loading: PropTypes.bool,
    measures: PropTypes.array
};
