import React, { useEffect, useRef, useState } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react';
import { Field, Form, Formik } from 'formik';
import Select from 'react-select';
import { GetWithToken, PostFileWithToken } from '../../../app/api/apiMethod';
import { FileUploader } from "react-drag-drop-files";
import * as Yup from 'yup';
import { Tooltip } from 'react-tooltip'
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../../../constance/AppUrl';

const fileTypes = ["JPG", "PNG", "GIF"];

export default function StrationInsert({ open, submit, onClose, data }) {
    const init = {
        value: null,
        label: 'Không chọn'
    }
    const [parentMenu, setParentMenu] = useState(init);
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orgSelected, setOrgSelected] = useState({
        // value: 0,
        // label: 'Không chọn'
    });
    const [fileUrl, setFileUrl] = useState('');
    const [preview, setPreview] = useState()
    const formRef = useRef();
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        PostFileWithToken({ url: '/api/Attachment?savePath=uploads%2FStration%2Favatars', file: file })
            .then(rs => {

                if (rs.status == 200) {
                    var pathFile = rs.data?.pathFile;
                    //   data.avatar = pathFile;

                    setFileUrl("/" + pathFile);

                } else {
                    toast.error('Thêm mới phương tiện xảy ra lỗi')
                }
            })
        setFile(file);
    };
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        GetWithToken({ url: '/api/Organization' })
            .then((rs) => {
                console.log(rs.status);
                if (rs.status == 200) {
                    setOrgs(() => {
                        return rs.data.data.map(e => {
                            return {
                                label: e.name,
                                value: e.id
                            };
                        });
                    });
                }
            })
    }, []);
    // useEffect(() => {
    //     if (!file) {
    //         setPreview(undefined)
    //         return
    //     }

    //     const objectUrl = URL.createObjectURL(file)
    //     setPreview(objectUrl);
    //     console.log(objectUrl);

    //     // free memory when ever this component is unmounted
    //     return () => URL.revokeObjectURL(objectUrl)
    // }, []);
    const onSelectFile = e => {

    }

    const InsertMenuSchema = Yup.object().shape({
        name: Yup.string()
            .required('Tên trạm là bắt buộc.'),
        code: Yup.string()
            .required('Mã trạm là bắt buộc.'),
        addresss: Yup.string()
            .required('Địa chỉ là bắt buộc.'),

        // organizationId: Yup.number().optional(),
        description: Yup.string()
            .optional(),


        // icon: Yup.string().required('Required'),
    });


    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        // console.log(formData);

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
            <Modal.Header>Thêm mới phương tiện</Modal.Header>
            <Modal.Content >
                <Formik
                    initialValues={{
                        name: "",
                        description: "",
                        latitude: 0,
                        longitude: 0,
                        addresss: "",
                        isActive: true,
                        code: ""
                    }}
                    validationSchema={InsertMenuSchema}
                    onSubmit={(values) => {
                        console.log(values);

                        //submit({ data: values });
                    }}
                >
                    {({ errors, touched }) => (
                        <Form  >
                            <div className='grid grid-cols-2'>
                                <div className='col-1'>
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Mã trạm <span className='text-danger' data-tooltip-content="Trường bắt buộc, không được để trống!">*</span>

                                    </label>
                                    <Field
                                        type='text'
                                        name='code'
                                        placeholder='Nhập mã của trạm'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.code && touched.code ? (
                                        <span className='text-danger'>{errors.code}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Tên trạm <span className='text-danger' data-tooltip-content="Trường bắt buộc, không được để trống!">*</span>

                                    </label>
                                    <Field
                                        type='text'
                                        name='name'
                                        placeholder='Nhập tên của trạm'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.name && touched.name ? (
                                        <span className='text-danger'>{errors.name}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Mô tả
                                    </label>
                                    <Field
                                        type='text'
                                        name='description'
                                        component='textarea'
                                        placeholder='Nhập mô tả'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.description && touched.description ? (
                                        <span className='text-danger'>{errors.description}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Địa chỉ <span className='text-danger' data-tooltip-content="Trường bắt buộc, không được để trống!">*</span>
                                    </label>
                                    <Field
                                        type='text'
                                        // component="textarea"
                                        name='addresss'
                                        placeholder='Nhập địa chỉ'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.addresss && touched.addresss ? (
                                        <span className='text-danger'>{errors.addresss}</span>
                                    ) : <span className='text-white'>{" "}</span>}

                                    <Tooltip anchorSelect='.text-danger' />
                                </div>
                                <div className="w-full h-32 flex flex-col mt-3">
                                    <div className="w-1/2 mr-2">
                                        <label className='mb-1 mt-3 block font-medium text-black dark:text-white w-full'>
                                            Thêm ảnh đại diện
                                        </label>
                                        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                                    </div>
                                    <div className="w-full flex flex-row justify-end m-4">
                                        {<img className='h-32 w-full rounded-lg object-cover' src={BASE_URL + fileUrl} />}
                                    </div>
                                </div>
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
