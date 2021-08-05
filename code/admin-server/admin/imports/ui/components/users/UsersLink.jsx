import React from "react";
import { FlowRouter } from "meteor/kadira:flow-router";
import PropTypes from "prop-types";

export default function UsersLink({ email, userId }) {
  return (
    <div>
      {email}
      <div>
        <a
          href={FlowRouter.path("Admin.userDetail", {
            userId
          })}
        >
          {userId}
        </a>
      </div>
    </div>
  );
}


UsersLink.propTypes = {
  email:PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
}
