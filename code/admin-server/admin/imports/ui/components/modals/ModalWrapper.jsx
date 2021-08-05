import React from "react";
import { Modal, Button } from "semantic-ui-react";
import PropTypes from "prop-types";

export default function ModalWrapper(props, context){
    const {modalsStore} = context
    const { title, children, hideHeader, hideFooter, size } = props;
    const calculatedSize = size ? size : "small";
    const onClose = () => modalsStore.removeModal();
    return (
      <Modal open onClose={onClose} size={calculatedSize}>
        {!hideHeader ? <Modal.Header>{title}</Modal.Header> : ""}

        <Modal.Content>{children}</Modal.Content>
        {!hideFooter ? (
          <Modal.Actions>
            <Button onClick={onClose}>Close</Button>
          </Modal.Actions>
        ) : (
          ""
        )}
      </Modal>
    );
  }


ModalWrapper.contextTypes = {
   modalsStore: PropTypes.shape({})
 };

ModalWrapper.propTypes = {
  title:PropTypes.string.isRequired,
  children:PropTypes.string.isRequired,
  hideHeader:PropTypes.string.isRequired,
  hideFooter:PropTypes.string.isRequired,
  size:PropTypes.string.isRequired
}
