import React from 'react';
import { Divider, Card, Button, Input, Image } from 'semantic-ui-react';
import Alerts from '../../../utils/alerts';

export default class DatalessMeasuresPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: ''
        };
        this.noValid = this.noValid.bind(this);
        this.addData = this.addData.bind(this);
    }

    noValid = e => {
        e.preventDefault();
        const { measure } = this.props;
        console.log(measure);
        this.setState({ isLoading: true });

        Meteor.call('remove.dataless.measure', { measureId: measure._id }, (error, data) => {
            if (error || data.error) {
                alert(error | data.error);
            }
            this.setState({ isLoading: false });
        });
    };

    addData = e => {
        e.preventDefault();

        const { data } = this.state;
        const { measure } = this.props;

        if (data.length === 0) return alert('Input something');
        if (isNaN(parseFloat(data))) return alert('No valid data');

        this.setState({ isLoading: true });

        Meteor.call('add.dataless.measure', { measureId: measure._id, data }, (error, data) => {
            if (error || data.error) {
                alert(error | data.error);
            }
            this.setState({ isLoading: false });
        });
    };

    handleInput = event => {
        this.setState({ data: event.target.value });
    };

    render() {
        const { measure } = this.props;
        const { isLoading } = this.state;

        return (
            <Card key={measure._id}>
                <Image src={measure.url} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{measure.path}</Card.Header>
                    <Card.Meta>
                        <span className="date">{measure.createdAt.toString()}</span>
                    </Card.Meta>
                    <Card.Description>
                        <Divider />
                        <div>
                            <Button
                                disabled={isLoading}
                                onClick={this.addData}
                                content="Add data"
                                floated="right"
                            />
                            <Input
                                onChange={this.handleInput}
                                placeholder="242412,321"
                                floated="left"
                            />
                        </div>
                        <Divider />
                    </Card.Description>
                    <Card.Description>
                        <Button disabled={isLoading} basic color="red" onClick={this.noValid}>
                            Not valid
                        </Button>
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    }
}
