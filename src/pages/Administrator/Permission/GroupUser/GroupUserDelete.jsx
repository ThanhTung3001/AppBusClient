import React from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

export default function GroupUserDelete({ open, onClose, submitDelete, data }) {
    return (
        <Modal
            onClose={onClose}
            onOpen={onClose}
            open={open}
        >
            <Modal.Header>Xoá menu</Modal.Header>
            <Modal.Content >
                <h3 className='text-black font-medium'>Bạn có muốn xoá menu: {<span className='font-bold'>{data.name}</span>} ?</h3>

            </Modal.Content>
            <Modal.Actions className='mt-4'>
                <Button color='black' onClick={onClose}>
                    Huỷ
                </Button>
                <Button
                    className='bg-danger'
                    content="Xoá"
                    labelPosition='right'
                    icon='checkmark'
                    type='button'
                    color='red'
                    onClick={() => submitDelete(data.id)}
                // positive

                />
            </Modal.Actions>
        </Modal>
    )
}
