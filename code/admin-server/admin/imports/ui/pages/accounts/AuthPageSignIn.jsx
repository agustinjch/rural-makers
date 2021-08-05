/* eslint-disable react/no-array-index-key */
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import React from 'react'
import {
  Button,
  Form,
  Segment,
  Divider,
  Header,
  Message
} from 'semantic-ui-react'

export default class SignInPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      email: '',
      password: '',
      loading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSubmit() {
    const { email } = this.state
    const { password } = this.state
    const errors = {}

    if (!email) {
      errors.email = 'Email required'
    }

    if (!password) {
      errors.password = 'Password required'
    }
    this.setState({ errors })
    if (Object.keys(errors).length) {
      return
    }
    this.setState({ loading: true })
    Meteor.loginWithPassword({ email }, password, err => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
          loading: false
        })
      } else {
        this.setState({ loading: false })
        const next = FlowRouter.getQueryParam('next')
        const redirect = next || '/'
        FlowRouter.go(redirect)
      }
    })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { errors, loading, email, password } = this.state
    const errorMessages = Object.keys(errors).map(key => errors[key])
    return (
      <Form className={`large ${loading ? 'loading' : ''}`}>
        <Segment raised padded>
          <Header as="h4" color="grey">
            Sign in to start your session
          </Header>
          <Divider hidden />
          {errorMessages.map((msg, index) => (
            <Message negative size="tiny" key={index}>
              {msg}
            </Message>
          ))}
          <Form.Input
            icon="user"
            iconPosition="left"
            type="email"
            name="email"
            onChange={this.handleChange}
            value={email}
            placeholder="Your email"
          />
          <Form.Input
            icon="lock"
            iconPosition="left"
            type="password"
            name="password"
            onChange={this.handleChange}
            value={password}
            placeholder="Password"
          />
          <Button fluid primary onClick={this.onSubmit}>
            Sign in
          </Button>
          <Divider />
          <div className="signIn-help">
            New to us?
            <a
              href={FlowRouter.path('Accounts.join')}
              className="accounts-join"
            >
              Join now
            </a>
          </div>
        </Segment>
      </Form>
    )
  }
}
