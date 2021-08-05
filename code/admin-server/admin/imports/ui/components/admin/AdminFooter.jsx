import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import PropTypes from 'prop-types'

require('./AdminFooter.less')

export default class AppFooter extends Component {
  constructor(props) {
    super(props)
    this.styles = {
      navbar: {
        marginBottom: 0
      }
    }
  }

  render() {
    const { styles } = this.props
    return (
      <footer id="adminfooter" style={styles}>
        <div className="footer-inner">
          <Header as="h4" size="tiny">
            {Meteor.settings.public.appName}
            <Header.Subheader>
              Copyright © 2017 . Made with love by
{' '}
{' '}
              <a
                href="http://www.mkn.media"
                target="_blank"
                rel="noopener noreferrer"
              >
                MKN.media
              </a>
            </Header.Subheader>
          </Header>
        </div>
      </footer>
    )
  }
}
AppFooter.propTypes = {
  styles: PropTypes.shape({}).isRequired
}
