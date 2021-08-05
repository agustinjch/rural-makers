/* eslint-disable react/no-array-index-key */
import { Accounts } from 'meteor/accounts-base'
import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Form, Segment, Header, Divider, Message } from 'semantic-ui-react'

import Alerts from '../../../utils/alerts'

import { validateEmail } from './Utils'

export default class AuthPageRecoveryPasswordPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      email: '',
      loading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()
    const { email } = this.state
    const errors = {}

    if (!email) {
      errors.email = 'Email required'
    } else {
      const validatedEmail = validateEmail(email)
      if (!validatedEmail) {
        errors.email = 'Invalid email'
      }
    }

    this.setState({ errors })
    if (Object.keys(errors).length) {
      return
    }
    const options = {
      email
    }
    this.setState({ loading: true })
    Accounts.forgotPassword(options, err => {
      if (err) {
        console.log(err)
        this.setState({
          errors: { none: err.reason },
          loading: false
        })
      } else {
        Alerts.success('Email successfully sent')
        FlowRouter.go('Accounts.signin')
      }
    })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { errors, loading } = this.state
    const errorMessages = Object.keys(errors).map(key => errors[key])
    return (
      <Form className={`large ${loading ? 'loading' : ''}`}>
        <Segment padded raised>
          <Header as="h4" color="grey">
            {'Recover your password'}
          </Header>
          <Divider hidden />
          {errorMessages.map((msg, index) => (
            <Message negative size="tiny" key={index}>
              {msg}
            </Message>
          ))}
          <Divider />
          <div className="signIn-help">
            {'Have an account?'}
            <a href={FlowRouter.path('Accounts.signin')}>Sign in here</a>
          </div>
          <div className="signIn-help">
            {'Have an account?'}
            <a
              href={FlowRouter.path('Accounts.join')}
              className="accounts-join"
            >
              {'Join now'}
            </a>
          </div>
        </Segment>
      </Form>
    )
  }
}
