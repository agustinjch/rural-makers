import React from "react";
import PropTypes from "prop-types";

export default class ModalManager extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {context } = this
    context.modalsStore.subscribe(() => this.forceUpdate());
  }

  render() {
    const {context } = this
    const currentModal = context.modalsStore.currentModal;
    //const onHide = () => context.modalsStore.removeModal();

    switch (currentModal && currentModal.modalType) {
      default:
        return null;
    }
  }
}

ModalManager.contextTypes = { modalsStore: PropTypes.shape({}) };
