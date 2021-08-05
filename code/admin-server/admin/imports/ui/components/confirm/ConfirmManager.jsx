import React from 'react'
import PropTypes from 'prop-types'
import { Confirm } from 'semantic-ui-react'

export default class ConfirmManager extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { confirmStore } = this.context
    confirmStore.subscribe(() => this.forceUpdate())
  }

  render() {
    const { confirmStore } = this.context
    const { text, open } = confirmStore
    const onCancel = () => confirmStore.hide()
    const onConfirm = () => confirmStore.callback()

    return (
      <Confirm
        content={text}
        open={open}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    )
  }
}

ConfirmManager.contextTypes = { confirmStore: PropTypes.shape({}).isRequired }
