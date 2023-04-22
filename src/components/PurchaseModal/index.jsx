import React from 'react'
import { Button, Modal, Container, Icon, Image, Item, Label, List, Rating } from 'semantic-ui-react';
import { usePurchaseTestMutation } from '../../store/store';



const PurchaseModal = ({ open, mountModal, setContent, test }) => {

  const [purchaseTest, { data, error, isLoading, isSuccess, isError }] = usePurchaseTestMutation();

  // console.log('test:', test)

  const handleOnClose = () => {
    // console.log(setContent)
    setContent({});
    mountModal(false);
  }

  const handlePurchase = () => {
    purchaseTest({
      id: test.id,
    });
  }

  return (
    <Modal
      onClose={handleOnClose}
      onOpen={() => setContent(test)}
      open={open}
    // trigger={<Button>Make Purchase</Button>}
    >
      <Modal.Header>Make Purchase</Modal.Header>
      <Modal.Content>
        <p>You are purchasing: {test?.id}</p>
        <p>Are you sure you want to make this purchase?</p>
        <p>You will be charged ${test?.config?.price} dollars</p>
        {isSuccess && <h2>Purchase completed. Amount $ {data.total}. Transaction ID: {data.purchaseId}</h2>}
        {isError && <h2>Unable to process the transaction. Please try again. {error}</h2>}
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={handleOnClose}>
          Cancel
        </Button>
        <Button
          content="Purchase"
          labelPosition='right'
          icon='checkmark'
          // onClick={() => alert('Purchase made!')}
          onClick={handlePurchase}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default PurchaseModal