import React from 'react'
import { Meteor } from 'meteor/meteor'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Grid, Dimmer, Loader, Container } from 'semantic-ui-react'
import AdminBar from '../../components/admin/AdminBar.jsx'
import AdminFooter from '../../components/admin/AdminFooter.jsx'
import AdminSideBar from '../../components/admin/AdminSideBar.jsx'
import Loading from '../../components/utils/Loading'

import ModalsStore from '../../stores/modalsStore'
import ModalManager from '../../components/modals/ModalManager'

import ConfirmStore from '../../stores/confirmStore'
import ConfirmManager from '../../components/confirm/ConfirmManager'

import Alerts from '../../../utils/alerts'

if (!Meteor.isTest) {
  require('./Admin.less')
  require('/imports/ui/stylesheets/styles.less')
}

// Pages
export default class Admin extends React.Component {
  constructor(props) {
    super(props)
    // console.log("Admin init", { props });
    this.logout = this.logout.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.modalsStore = new ModalsStore()
    this.confirmStore = new ConfirmStore()
    let sideBarVisible = true
    if ($(window).width() < 720) {
      sideBarVisible = false
    }
    this.state = {
      showConnectionIssue: false,
      sideBarVisible
    }
  }

  componentWillReceiveProps({ currentUser, loading }) {
    const current = FlowRouter.current()
    const currentRouteName = current.route.name
    if (!loading && !currentUser) {
      if (currentRouteName != 'Accounts.signin') {
        const next = current.path
        FlowRouter.go('Accounts.signin', {}, { next })
        return
      }
      FlowRouter.go('Accounts.signin')
    }
  }

  updateDimensions() {
    // console.log("updateDimensions");
    this.setState({ width: $(window).width(), height: $(window).height() })
    if ($(window).width() < 720) {
      this.setState({ sideBarVisible: false })
    } else {
      this.setState({ sideBarVisible: true })
    }
  }

  componentWillMount() {
    // console.log("app will mount");
    // this.updateDimensions();
  }

  componentDidMount() {
    // console.log("app did mount");
    document.body.className = ''
    window.addEventListener('resize', this.updateDimensions)
    this.updateDimensions()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  getChildContext() {
    return {
      modalsStore: this.modalsStore,
      confirmStore: this.confirmStore,
      currentUser: this.props.currentUser
    }
  }

  logout() {
    Meteor.logout(err => {
      // callback
      if (err) {
        Alerts.error(err.reason)
      }
      FlowRouter.go('/signin')
    })
  }

  toggleSideBar = () => {
    console.log('toggleSideBar')
    this.setState({ sideBarVisible: !this.state.sideBarVisible })
  }

  render() {
    // console.log("app render", { state: this.state });
    const { currentUser, loading, children, location } = this.props

    const { sideBarVisible } = this.state
    const mainStyles = {}
    const footerStyles = {}
    if (sideBarVisible) {
      mainStyles.marginLeft = 210
      footerStyles.paddingLeft = 210
    }
    return (
      <div style={{ height: '100%' }}>
        {!currentUser ? (
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
        ) : (
          <Container fluid id="app-container">
            <AdminSideBar visible={sideBarVisible} />
            <div id="main" style={mainStyles}>
              <AdminBar
                currentUser={currentUser}
                logout={this.logout}
                toggleSideBar={this.toggleSideBar}
                sideBarVisible={sideBarVisible}
              />

              <ModalManager />
              <ConfirmManager />
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    {loading ? (
                      <Loading />
                    ) : (
                      <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionEnterTimeout={200}
                        transitionLeaveTimeout={200}
                      >
                        {currentUser ? (
                          <div>
                            <this.props.content.component
                              {...this.props.content.props}
                              currentUser={currentUser}
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </ReactCSSTransitionGroup>
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            <AdminFooter styles={footerStyles} />
          </Container>
        )}
      </div>
    )
  }
}
Admin.propTypes = {
  currentUser: PropTypes.object,
  // current meteor currentUser
  // server connection status
  loading: PropTypes.bool,
  children: PropTypes.element,
  // matched child route component
  location: PropTypes.object,
  // current router location
  // parameters of the current route
  params: PropTypes.object
}

// Admin.contextTypes = {
//   router: React.PropTypes.object
// };

Admin.childContextTypes = {
  modalsStore: PropTypes.object,
  confirmStore: PropTypes.object,
  currentUser: PropTypes.object
}
