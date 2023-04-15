import React from 'react'
import { Button, Modal, Container, Icon, Image, Item, Label, List, Rating } from 'semantic-ui-react'



const PurchaseModal = ({ open, setOpen, setContent, test }) => {

  // console.log('test:', test)

  const handleOnClose = () => {
    // console.log(setContent)
    setContent({});
    setOpen(false);
  }

  return (
    <Modal
      onClose={handleOnClose}
      onOpen={() => setOpen(true)}
      open={open}
    // trigger={<Button>Make Purchase</Button>}
    >
      <Modal.Header>Make Purchase</Modal.Header>
      <Modal.Content>
        <p>You are purchasing: {test?.id}</p>
        <p>Are you sure you want to make this purchase?</p>
        <p>You will be charged ${test?.price} dollars</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={handleOnClose}>
          Cancel
        </Button>
        <Button
          content="Purchase"
          labelPosition='right'
          icon='checkmark'
          onClick={() => alert('Purchase made!')}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default PurchaseModal