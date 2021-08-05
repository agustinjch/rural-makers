import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import SmartTable from "../utils/tables/SmartTable";
import UsersLink from "./UsersLink";
import { booleanToIcon, getLabelForRole } from "../../utils/utils";

export default class UsersTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selector, hideHeader } = this.props;
    return (
      <SmartTable
        collection={Meteor.users}
        publication="admin.users"
        selector={selector}
        searchableFields={["emails.address", "username"]}
        title="Users"
        orderBy={{ field: "createdAt", ordering: -1 }}
        hideHeader={hideHeader}
        columns={[
          {
            label: "Created At",
            data: "createdAt",
            orderable: true
          },
          {
            label: "user",
            data: "username",
            render: user => {
              if (user.emails && user.emails.length > 0 ){
                return user.emails[0].address
                // return <UsersLink email={user.emails[0].address} userId={user._id} />
              } else if (user.username) {
                return user.username;
              } else {
                  return null;
              }
            }
          },
          {
            label: "Verified",
            data: "emails",
            render: user => {
              if (user.emails && user.emails.length > 0 ){
                  return booleanToIcon(user.emails[0].verified)
              } else {
                  return null
              }
            }
          },
          {
            label: "Roles",
            data: "roles",
            searchable: false,
            render: user => {
              const role = user.roles && user.roles[0];
              return (
                <div>
                  {role ? getLabelForRole(role) : ""}
                </div>
              );
            }
          }
        ]}
      />
    );
  }
}

UsersTable.defaultProps = {
  selector: undefined,
  hideHeader: undefined
}

UsersTable.propTypes = {
  hideHeader:PropTypes.string,
  selector:PropTypes.string
}
