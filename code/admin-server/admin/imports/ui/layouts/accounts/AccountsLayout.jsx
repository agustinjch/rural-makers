import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
// import PropTypes from 'prop-types'
import { FlowRouter } from 'meteor/kadira:flow-router'

import './AccountsLayout.less'
import { Grid, Header } from 'semantic-ui-react'

export default class AccountsLayout extends Component {
  componentWillMount() {
    document.body.className = 'login'
  }

  componentWillReceiveProps({ isLoggedIn, routeName }) {
    console.log('Accounts componentWillReceiveProps:', {
      routeName
    })

    if (routeName === 'Admin.home') {
      FlowRouter.go('Accounts.signin')
    }
    if (isLoggedIn) {
      FlowRouter.go('Admin.dashboard')
    }
  }

  render() {
    const { user, connected, children, location } = this.props
    return (
      <Grid className="middle center aligned">
        <Grid.Column>
          <Header as="h1" color="red" className="siteFont" size="huge">
            {Meteor.settings.public.appName}
          </Header>
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {this.props.content}
          </ReactCSSTransitionGroup>
        </Grid.Column>
      </Grid>
    )
  }
}
