import { withTracker } from 'meteor/react-meteor-data'
import UsersPage from '../../pages/users/UsersPage'

export default withTracker(({ currentUser }) => {
  const loading = false
  return {
    loading,
    currentUser
  }
})(UsersPage)
