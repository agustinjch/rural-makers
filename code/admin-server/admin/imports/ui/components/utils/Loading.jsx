import React, { Component } from 'react'
import Spinner from 'react-spinner'

import '../../stylesheets/Loading.less'

export default class Loading extends Component {
  _renderLoadingMessage() {
    if (this.props.text) return this.props.text
    return 'Loading'
  }

  render() {
    const style = {
      padding: '40px'
    }
    return (
      <div className="loading-spinner" style={style}>
        <Spinner />
      </div>
    )
  }
}
