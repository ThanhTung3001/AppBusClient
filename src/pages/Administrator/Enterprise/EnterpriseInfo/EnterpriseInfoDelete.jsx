import React from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

export default function EnterpriseInfoDelete({ open, onClose, submitDelete, data }) {
    return (
        <Modal
            className='max-w-180'
            onClose={onClose}
            onOpen={onClose}
            open={open}
        >
            <Modal.Header>Xoá dữ liệu</Modal.Header>
            <Modal.Content >
                <h3 className='text-black font-medium'>Bạn có muốn xoá doanh nghiệp: {<span className='font-bold'>{data.name}</span>} ?</h3>

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
