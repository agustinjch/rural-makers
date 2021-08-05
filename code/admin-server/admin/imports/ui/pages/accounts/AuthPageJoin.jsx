import React from 'react'
import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/kadira:flow-router'
import {
  Button,
  Form,
  Segment,
  Header,
  Divider,
  Message
} from 'semantic-ui-react'

export default class JoinPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      code: '',
      email: '',
      loading: false,
      password: '',
      confirm: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()
    const { email, password, confirm, code } = this.state

    const errors = {}

    if (!email) {
      errors.email = 'Emal required'
    }

    if (!password) {
      errors.password = 'Password required'
    }
    if (confirm !== password) {
      errors.confirm = 'Confirm password'
    }
    if (!code) {
      errors.code = 'Invalid code'
    }

    this.setState({ errors })
    if (Object.keys(errors).length) {
      return
    }
    this.setState({ loading: true })
    const profile = { code }
    Accounts.createUser(
      {
        email,
        password,
        profile
      },
      err => {
        if (err) {
          console.log(err)
          this.setState({
            errors: { none: err.reason },
            loading: false
          })
          return
        }
        this.setState({ loading: false })
        FlowRouter.go('/')
      }
    )
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { errors, loading, email, password, confirm, code } = this.state
    const errorMessages = Object.keys(errors).map(key => errors[key])

    return (
      <Form className={`large ${loading ? 'loading' : ''}`}>
        <Segment raised padded>
          <Header as="h4" color="grey">
            {'Create an account'}
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
            placeholder="Email"
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
          <Form.Input
            icon="lock"
            iconPosition="left"
            type="password"
            name="confirm"
            onChange={this.handleChange}
            value={confirm}
            placeholder="Password again"
          />
          <Form.Input
            icon="privacy"
            iconPosition="left"
            placeholder="Code"
            type="password"
            name="code"
            onChange={this.handleChange}
            value={code}
          />
          <Button fluid primary onClick={this.onSubmit}>
            {'Join now'}
          </Button>
          <Divider />
          <div className="signIn-help">
            {'Do you have an account?'}
            <a href={FlowRouter.path('Accounts.signin')}>Sign in</a>
          </div>
        </Segment>
      </Form>
    )
  }
}
