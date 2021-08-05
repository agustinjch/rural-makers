import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default function CounterDetailHeader(props) {
    const { counter } = props;
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{counter.address}</Card.Header>
                <Card.Meta>Counter id: {counter.id}</Card.Meta>
                <Card.Description></Card.Description>
            </Card.Content>
        </Card>
    );
}

CounterDetailHeader.contextTypes = {
    modalsStore: PropTypes.shape({}),
    confirmStore: PropTypes.shape({})
};

CounterDetailHeader.propTypes = {
    counter: PropTypes.shape({}).isRequired
};
