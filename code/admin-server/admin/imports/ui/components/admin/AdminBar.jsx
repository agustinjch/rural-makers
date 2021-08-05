import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { FlowRouter } from "meteor/kadira:flow-router";
import { Menu, Icon, Dropdown } from "semantic-ui-react";

if (!Meteor.isTest) {
  require("./AdminBar.less");
}

export default class AdminBar extends Component {
  constructor(props) {
    super(props);
    this.addServiceAccountModal = this.addServiceAccountModal.bind(this);
  }

  addServiceAccountModal(e) {
    e.preventDefault();
    const {modalsStore} = this.context

    modalsStore.setCurrentModal({
      modalType: "SERVICEACCOUNTS_CREATE",
      modalData: { service: "instagram" }
    });
  }
  pathFor(pathName) {
    return FlowRouter.path(pathName);
  }
  render() {
    const {currentUser,logout,toggleSideBar,sideBarVisible} = this.props;

    return (
      <Menu fixed="top" id="adminbar" size="large" className="adminbar">
        <Menu.Item className={`brand ${sideBarVisible ? "visible" : "hidden"}`}>
          {Meteor.settings.public.appName}
        </Menu.Item>
        <Menu.Item>
          <Icon link name="content" onClick={toggleSideBar} size="large" />
        </Menu.Item>
        <Menu.Menu position="right">
          <Dropdown
            item
            text={currentUser.emails ? currentUser.emails[0].address : currentUser.username ? currentUser.username : null}
          >
            <Dropdown.Menu>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout}>
                <Icon name="sign out" />
                {' '}
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }
}

AdminBar.propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  logout:PropTypes.func.isRequired,
  toggleSideBar:PropTypes.func.isRequired,
  sideBarVisible: PropTypes.bool.isRequired
}

AdminBar.contextTypes = {
  modalsStore: PropTypes.shape({}),
  currentUser: PropTypes.shape({})
};
