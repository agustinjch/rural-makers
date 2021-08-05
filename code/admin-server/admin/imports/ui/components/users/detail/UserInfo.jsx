import React from "react";
import PropTypes from "prop-types";
import UsersTable from "../UsersTable";

export default function UserInfo(props) {
    const { user } = props;
    return (
      <div>
        <UsersTable selector={{ _id: user._id }} hideHeader />
      </div>
    );
  }

UserInfo.propTypes = {
  user: PropTypes.shape({}).isRequired
}
