import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'
import AccountsLayout from '../../layouts/accounts/AccountsLayout.jsx'

export default withTracker(({ content }) => {
  return {
    user: Meteor.user(),
    connected: Meteor.status().connected,
    isLoggedIn: Meteor.userId() !== null,
    content,
    routeName: FlowRouter.getRouteName()
  }
})(AccountsLayout)
