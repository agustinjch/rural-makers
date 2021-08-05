/* eslint-disable react/no-array-index-key */
import { Accounts } from 'meteor/accounts-base'
import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Form, Segment, Header, Divider, Message } from 'semantic-ui-react'

export default class AuthPageResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      token: FlowRouter.getParam('token'),
      password: '',
      confirm: '',
      loading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()
    const { token } = this.state
    const { password } = this.state
    const { confirm } = this.state
    const errors = {}

    if (!password) {
      errors.password = 'Password required'
    }
    if (confirm !== password) {
      errors.confirm = 'Please confirm your password'
    }

    this.setState({ errors })
    if (Object.keys(errors).length) {
      return
    }
    this.setState({ loading: true })
    Accounts.resetPassword(token, password, err => {
      if (err) {
        console.log(err)
        this.setState({
          errors: { none: err.reason, loading: false }
        })
      } else {
        FlowRouter.go('/')
      }
    })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { errors, loading, confirm, password } = this.state
    const errorMessages = Object.keys(errors).map(key => errors[key])
    return (
      <Form className={`large ${loading ? 'loading' : ''}`}>
        <Segment padded raised>
          <Header as="h4" color="grey">
            Recover your password
          </Header>
          <Divider hidden />
          {errorMessages.map((msg, index) => (
            <Message negative size="tiny" key={index}>
              {msg}
            </Message>
          ))}
          <Form.Input
            icon="lock"
            iconPosition="left"
            type="password"
            name="password"
            onChange={this.handleChange}
            value={password}
            placeholder="Password"
          />
          <Form.Input
            icon="lock"
            iconPosition="left"
            type="password"
            name="confirm"
            onChange={this.handleChange}
            value={confirm}
            placeholder="Password again"
          />

          <Divider />
          <div className="signIn-help">
            Do you have an account?
            <a href={FlowRouter.path('Accounts.signin')}>Sign in</a>
          </div>
          <div className="signIn-help">
            {'Need an account?'}
            <a
              href={FlowRouter.path('Accounts.join')}
              className="accounts-join"
            >
              {'Joi now'}
            </a>
          </div>
        </Segment>
      </Form>
    )
  }
}
