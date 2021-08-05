import React from "react";
import { Card, Label } from "semantic-ui-react";
import PropTypes from "prop-types";

export default function UsersDetailHeader(props) {
    const { user } = props;
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>
            {user.emails[0].address}
          </Card.Header>
          <Card.Meta>
            {user.roles &&
              user.roles.map(role => (
                <Label key={user._id} size="mini">
                  {role}
                </Label>
              ))}
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }

UsersDetailHeader.contextTypes = {
  modalsStore: PropTypes.shape({}),
  confirmStore: PropTypes.shape({})
};

UsersDetailHeader.propTypes = {
  user: PropTypes.shape({}).isRequired
}
