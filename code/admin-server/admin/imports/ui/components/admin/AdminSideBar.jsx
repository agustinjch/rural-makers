/* eslint-disable global-require */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlowHelpers } from '../../utils/FlowHelpers';

if (!Meteor.isTest) {
    require('./AdminSideBar.less');
}

export default class AdminSideBar extends Component {
    getPath(pathName) {
        return FlowRouter.path(pathName);
    }

    truncateUsersEmail() {
        const { currentUser } = this.props;
        const email = currentUser && currentUser.emails[0].address;

        return email;
    }

    render() {
        const { visible } = this.props;
        const styles = {};
        if (!visible) {
            styles.marginLeft = -210;
        }
        return (
            <Menu fixed="left" vertical inverted id="adminsidebar" style={styles}>
                <Menu.Item
                    href={this.getPath('Admin.dashboard')}
                    active={FlowHelpers.currentRoute('Admin.dashboard')}
                >
                    <Icon name="users" />
                    Dashboard
                </Menu.Item>
                <Menu.Item
                    href={this.getPath('Admin.users')}
                    active={FlowHelpers.currentRoute('Admin.users')}
                >
                    <Icon name="users" />
                    Users
                </Menu.Item>
                <Menu.Item
                    href={this.getPath('Admin.counters')}
                    active={FlowHelpers.currentRoute('Admin.counters')}
                >
                    <Icon name="users" />
                    Counters
                </Menu.Item>
                <Menu.Item
                    href={this.getPath('Admin.measures')}
                    active={FlowHelpers.currentRoute('Admin.measures')}
                >
                    <Icon name="users" />
                    Measures to do
                </Menu.Item>
            </Menu>
        );
    }
}

AdminSideBar.defaultProps = {
    visible: false,
    currentUser: null
};

AdminSideBar.propTypes = {
    visible: PropTypes.bool,
    currentUser: PropTypes.shape({})
};
