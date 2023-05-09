import React, { useEffect, useRef, useState } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react';
import { Field, Form, Formik } from 'formik';
import Select from 'react-select';
import { GetWithToken } from '../../../../app/api/apiMethod';
import * as Yup from 'yup';


export function GroupUserInsert({ open, submit, onClose, data }) {

    const [parentMenu, setParentMenu] = useState(data?.menuUsers?.map(e => {
        return { value: e.menuId, label: e?.menu?.name }
    }));
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true);
    const formRef = useRef();
    useEffect(() => {
        GetWithToken({ url: `/api/Menu/GetAll` })
            .then(rs => {
                if (rs.status == 200) {
                    setLoading(false);

                    var menuResponse = rs.data.data.map((e, index) => {
                        return { value: e.id, label: e.name }
                    })
                    //   menuResponse.unshift(init);
                    setMenuList(menuResponse);

                }
            })
    }, []);
    const InsertMenuSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống').min(3, 'Quá ngắn').max(20, 'Quá dài'),
        //  path: Yup.string().required('Không được để trống').max(20, 'Quá dài'),
        // icon: Yup.string().required('Required'),
    });


    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        console.log(formData);

    };
    const handleClick = () => {
        formRef.current.submit();
    }
    return (
        <Modal
            onClose={onClose}
            onOpen={onClose}
            open={open}
        >
            <Modal.Header>Thêm mới vai trò</Modal.Header>
            <Modal.Content >
                <Formik
                    initialValues={{ name: '' }}
                    validationSchema={InsertMenuSchema}
                    onSubmit={(values) => {
                        console.log(parentMenu)

                    }}
                >
                    {({ errors, touched }) => (
                        <Form  >
                            <div className='grid grid-cols-2'>
                                <div className='col-1'>
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Tên vai trò
                                    </label>
                                    <Field
                                        type='text'
                                        name='name'
                                        placeholder='Nhập tên của menu'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.name && touched.name ? (
                                        <span className='text-danger'>{errors.name}</span>
                                    ) : null}

                                </div>
                                <div className='col-1 ml-2'>

                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Chọn menu
                                    </label>
                                    <Select options={menuList} isMulti onChange={(e) => setParentMenu(e)} value={parentMenu} />

                                </div>
                            </div>
                            <div className="flex flex-row justify-end w-full mt-4 border-t-2 border-gray mb-4">
                                <Modal.Actions className='mt-4'>
                                    <Button color='black' onClick={onClose}>
                                        Huỷ
                                    </Button>
                                    <Button
                                        content="Thêm mới"
                                        labelPosition='right'
                                        icon='checkmark'
                                        type='submit'

                                        positive
                                    />
                                </Modal.Actions>
                            </div>
                        </Form>
                    )}
                </Formik>

            </Modal.Content>

        </Modal>
    )
}
