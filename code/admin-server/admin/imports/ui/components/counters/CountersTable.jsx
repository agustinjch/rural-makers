/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SmartTable from '../utils/tables/SmartTable';
import { Counters } from '../../../api/counters/collections';

export default function CountersTable({ selector, hideHeader, additionalHeaderItems }) {
    return (
        <SmartTable
            collection={Counters}
            selector={selector}
            publication="admin.counters"
            title="Counters"
            extraFields={[]}
            orderBy={{ field: 'date', ordering: 1 }}
            additionalHeaderItems={additionalHeaderItems}
            hideHeader={hideHeader}
            columns={[
                {
                    label: 'Address',
                    data: 'address',
                    displayName: 'Address',
                    render: counter => {
                        return (
                            <>
                                <a
                                    href={FlowRouter.path('Admin.counterDetail', {
                                        counterId: counter.id
                                    })}
                                >
                                    {counter.address}
                                </a>
                            </>
                        );
                    }
                },
                {
                    label: 'ID',
                    data: 'id'
                },
                {
                    label: 'active',
                    data: 'active'
                },
                {
                    label: 'hasRelative',
                    data: 'hasRelative'
                },
                {
                    label: 'hasAbsolute',
                    data: 'hasAbsolute'
                },
                {
                    label: 'createdAt',
                    data: 'createdAt'
                }
            ]}
        />
    );
}

CountersTable.propTypes = {
    selector: PropTypes.shape({}),
    hideHeader: PropTypes.bool
};

CountersTable.defaultProps = {
    selector: {},
    hideHeader: true
};
