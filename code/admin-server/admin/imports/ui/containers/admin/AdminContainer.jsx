import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Admin from '../../layouts/admin/Admin.jsx'

export default withTracker(() => {
  const currentUser = Meteor.user()
  const userHandle = Meteor.subscribe('users.data')
  const loading = !userHandle.ready()

  console.log({ currentUser, loading, connected: Meteor.status().connected })

  return {
    currentUser,
    loading
  }
})(Admin)
