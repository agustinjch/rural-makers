import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { FlowRouter } from "meteor/kadira:flow-router";

import UserDetailPage from "../../pages/users/UserDetailPage";

export default withTracker(() => {
  const userId = FlowRouter.getParam("userId");
  // const userHandle = Meteor.subscribe("admin.usersDetail", { userId });
  // const loading = !userHandle.ready();


  const user = Meteor.users.findOne(userId);
  return {
    loading: false,
    user,
    userId
  };
})(UserDetailPage);
