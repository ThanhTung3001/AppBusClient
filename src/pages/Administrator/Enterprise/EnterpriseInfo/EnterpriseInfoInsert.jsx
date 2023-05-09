import React, { useEffect, useRef, useState } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react';
import { Field, Form, Formik } from 'formik';
import Select from 'react-select';
import { GetWithToken } from '../../../../app/api/apiMethod';
import { FileUploader } from "react-drag-drop-files";
import * as Yup from 'yup';

const fileTypes = ["JPG", "PNG", "GIF"];

export default function EnterpriseInfoInsert({ open, submit, onClose, data }) {
    const init = {
        value: null,
        label: 'Không chọn'
    }
    const [parentMenu, setParentMenu] = useState(init);
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true);
    const formRef = useRef();
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
    };
    const InsertMenuSchema = Yup.object().shape({
        name: Yup.string().required('Tên không được để trống'),
        phoneNumber: Yup.string()
            .matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không đúng định dạng'),
        taxCode: Yup.string().required('Mã số thuế không được để trống'),
        address: Yup.string().required('Địa chỉ không được để trống'),
        email: Yup.string().email('Email không hợp lệ').optional(),
        isActive: Yup.boolean().optional(),
        introduction: Yup.string().optional(),
        webSiteAddress: Yup.string().url('Địa chỉ website không hợp lệ').optional(),
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
            <Modal.Header>Thêm mới doanh nghiệp</Modal.Header>
            <Modal.Content >
                <Formik
                    initialValues={{
                        name: "",
                        phoneNumber: "",
                        taxCode: "",
                        address: "",
                        email: "",
                        isActive: true,
                        introduction: "",
                        webSiteAddress: ""
                    }}
                    validationSchema={InsertMenuSchema}
                    onSubmit={(values) => {



                        console.log(values);
                        submit({ data: values, file });
                    }}
                >
                    {({ errors, touched }) => (
                        <Form  >
                            <div className='grid grid-cols-2'>
                                <div className='col-1'>
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Tên doanh nghiệp
                                    </label>
                                    <Field
                                        type='text'
                                        name='name'
                                        placeholder='Nhập tên của doanh nghiệp'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.name && touched.name ? (
                                        <span className='text-danger'>{errors.name}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Mã số thuế
                                    </label>
                                    <Field
                                        type='text'
                                        name='taxCode'
                                        placeholder='Nhập mã số thuế'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.name && touched.name ? (
                                        <span className='text-danger'>{errors.name}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Địa chỉ
                                    </label>
                                    <Field
                                        type='text'
                                        component="textarea"
                                        name='address'
                                        placeholder='Nhập địa chỉ'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Số điện thoại
                                    </label>
                                    <Field
                                        type='text'
                                        name='phoneNumber'
                                        placeholder='Nhập số điện thoại'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.phoneNumber && touched.phoneNumber ? (
                                        <span className='text-danger'>{errors.phoneNumber}</span>
                                    ) : <span className='text-white'>{" "}</span>}

                                    {errors.address && touched.address ? (
                                        <span className='text-danger'>{errors.address}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <div className="flex flex-col">
                                        <span className='mb-1 block text-black dark:text-white mt-3' >
                                            Sử dụng
                                        </span>
                                        <Field
                                            type='checkbox'
                                            name='isActive'
                                            placeholder='Nhập đường dẫn'
                                            className='mt-4 w-5 h-5 ml-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>
                                <div className='col-1 ml-2'>
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Thư điện tử
                                    </label>
                                    <Field
                                        type='email'
                                        name='email'
                                        placeholder='Nhập email'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.email && touched.email ? (
                                        <span className='text-danger'>{errors.email}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Trang chủ
                                    </label>
                                    <Field
                                        type='text'
                                        name='webSiteAddress'
                                        placeholder='Điền link website'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.webSiteAddress && touched.webSiteAddress ? (
                                        <span className='text-danger'>{errors.webSiteAddress}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Giới thiệu
                                    </label>
                                    <Field
                                        type='text'
                                        component="textarea"
                                        name='introduction'
                                        placeholder='Thêm giới thiệu cho doanh nghiệp'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.introduction && touched.introduction ? (
                                        <span className='text-danger'>{errors.introduction}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 mt-3 block font-medium text-black dark:text-white w-full'>
                                        Thêm ảnh đại diện
                                    </label>
                                    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
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
