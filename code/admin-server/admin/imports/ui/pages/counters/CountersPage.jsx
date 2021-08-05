import PropTypes from 'prop-types';
import React from 'react';
import PageHeader from '../../components/admin/PageHeader';
import Loading from '../../components/utils/Loading';
import CountersTable from '../../components/counters/CountersTable';

export default class CountersPage extends React.Component {
    render() {
        const { loading } = this.props;
        return (
            <div>
                <PageHeader title="Counters" />
                <section className="content">
                    {loading ? <Loading /> : <CountersTable hideHeader={false} />}
                </section>
            </div>
        );
    }
}

CountersPage.defaultProps = {
    job: null,
    currentUser: null,
    loading: false
};

CountersPage.propTypes = {
    job: PropTypes.shape({}),
    currentUser: PropTypes.shape({}),
    loading: PropTypes.bool
};
