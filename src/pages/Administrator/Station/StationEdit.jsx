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

export default function StrationEdit({ open, submit, onClose, data }) {
    const init = {
        value: null,
        label: 'Không chọn'
    }
    const [parentMenu, setParentMenu] = useState(init);
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orgSelected, setOrgSelected] = useState({
        value: data.organizationId,
        label: data.organization.name

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

    const EditMenuSchema = Yup.object().shape({
        model: Yup.string()
            .required('Tên phương tiện là bắt buộc.'),
        plateNumber: Yup.string()
            .matches(/^\d{2}[A-Z]-\d{5}$/, 'Số xe không hợp lệ (phải theo định dạng 00A-00000).')
            .required('Số xe là bắt buộc.'),
        capacity: Yup.number()
            .integer('Số chổ ngồi phải là một số nguyên.')
            .min(1, 'Số chổ ngồi phải lớn hơn hoặc bằng 1.')
            .optional(),

        // organizationId: Yup.number().optional(),
        lastMaintenanceDate: Yup.date()
            .required('Ngày bảo trì cuối cùng là bắt buộc.'),
        totalMileage: Yup.number()
            .integer('Tổng số Km đi được phải là một số nguyên.')
            .min(0, 'Tổng số Km đi được phải lớn hơn hoặc bằng 0.')
            .optional(),
        registrationYear: Yup.date()
            .required('Năm đăng ký là bắt buộc.'),
        chassisNumber: Yup.string()
            .required('Số khung là bắt buộc.'),
        engineNumber: Yup.string()
            .required('Số máy là bắt buộc.'),
        isActive: Yup.boolean()
            .required('Trạng thái hoạt động là bắt buộc.'),
        numberOfSeats: Yup.number()
            .integer('Số ghế phải là một số nguyên.')
            .min(1, 'Số ghế phải lớn hơn hoặc bằng 1.')
            .required('Số ghế là bắt buộc.'),

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
                        model: data.model,
                        plateNumber: data.plateNumber,
                        capacity: data.capacity,
                        lastMaintenanceDate: moment().format('YYYY-MM-DD'),
                        isActive: true,
                        totalMileage: data.totalMileage,
                        registrationYear: moment().format('YYYY-MM-DD'),
                        chassisNumber: data.chassisNumber,
                        engineNumber: data.engineNumber,
                        numberOfSeats: data.numberOfSeats,

                    }}
                    validationSchema={EditMenuSchema}
                    onSubmit={(values) => {
                        // console.log(values);
                        values.organizationId = orgSelected.value;
                        values.avatar = fileUrl;
                        values.registrationYear = moment(values.registrationYear).year;
                        submit({ data: values });
                    }}
                >
                    {({ errors, touched }) => (
                        <Form  >
                            <div className='grid grid-cols-2'>
                                <div className='col-1'>
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Tên phương tiện <span className='text-danger' data-tooltip-content="Trường bắt buộc, không được để trống!">*</span>

                                    </label>
                                    <Field
                                        type='text'
                                        name='model'
                                        placeholder='Nhập của phương tiện'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.model && touched.model ? (
                                        <span className='text-danger'>{errors.model}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3'>
                                        Biển số xe <span className='text-danger' data-tooltip-content="Trường bắt buộc, không được để trống!">*</span>
                                    </label>
                                    <Field
                                        type='text'
                                        name='plateNumber'
                                        placeholder='Nhập biển số xe'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.plateNumber && touched.plateNumber ? (
                                        <span className='text-danger'>{errors.plateNumber}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Thể tích
                                    </label>
                                    <Field
                                        type='number'
                                        // component="textarea"
                                        name='capacity'
                                        placeholder='Nhập thể tích'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.capacity && touched.capacity ? (
                                        <span className='text-danger'>{errors.capacity}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Số ghế <span className='text-danger' data-tooltip-content="Trường bắt buộc, không được để trống!">*</span>
                                    </label>
                                    <Field
                                        type='number'
                                        name='numberOfSeats'
                                        placeholder='Nhập số ghế'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.numberOfSeats && touched.numberOfSeats ? (
                                        <span className='text-danger'>{errors.numberOfSeats}</span>
                                    ) : <span className='text-white'>{" "}</span>}

                                    {/* {errors.address && touched.address ? (
                                        <span className='text-danger'>{errors.address}</span>
                                    ) : <span className='text-white'>{" "}</span>} */}

                                    <div className="flex flex-col">
                                        <span className='mb-1 block text-black dark:text-white mt-3' >
                                            Thuộc doanh nghiệp
                                        </span>
                                        <Select
                                            options={orgs}
                                            value={orgSelected}
                                            onChange={(e) => setOrgSelected(e)}
                                            required
                                        />
                                    </div>

                                </div>
                                <div className='col-1 ml-2'>
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Ngày bảo dưỡng gần nhất
                                    </label>
                                    <Field
                                        type='date'
                                        name='lastMaintenanceDate'
                                        placeholder='Nhập ngày bảo dưỡng gần nhất'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.lastMaintenanceDate && touched.lastMaintenanceDate ? (
                                        <span className='text-danger'>{errors.lastMaintenanceDate}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Tổng km đã đi
                                    </label>
                                    <Field
                                        type='number'
                                        name='totalMileage'
                                        placeholder='Nhập tổng km đã đi'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.webSiteAddress && touched.webSiteAddress ? (
                                        <span className='text-danger'>{errors.webSiteAddress}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Năm đăng ký
                                    </label>
                                    <Field
                                        type='date'
                                        name='registrationYear'
                                        placeholder='Năm đăng ký'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.registrationYear && touched.registrationYear ? (
                                        <span className='text-danger'>{errors.registrationYear}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Số khung
                                    </label>
                                    <Field
                                        type='text'
                                        name='chassisNumber'
                                        placeholder='Nhập số khung'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.chassisNumber && touched.chassisNumber ? (
                                        <span className='text-danger'>{errors.chassisNumber}</span>
                                    ) : <span className='text-white'>{" "}</span>}
                                    <label className='mb-1 block text-black dark:text-white mt-3' >
                                        Nhập số máy
                                    </label>
                                    <Field
                                        type='text'

                                        name='engineNumber'
                                        placeholder='Nhập số máy'
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    {errors.engineNumber && touched.engineNumber ? (
                                        <span className='text-danger'>{errors.engineNumber}</span>
                                    ) : <span className='text-white'>{" "}</span>}

                                </div>
                                <Tooltip anchorSelect='.text-danger' />
                            </div>
                            <div className="w-full h-32 flex flex-rowm mt-3">
                                <div className="w-1/2 mr-2">
                                    <label className='mb-1 mt-3 block font-medium text-black dark:text-white w-full'>
                                        Thêm ảnh đại diện
                                    </label>
                                    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                                </div>
                                <div className="w-1/2 flex flex-row justify-end">
                                    {file != null ? <img className='h-32 w-full rounded-lg object-cover' src={BASE_URL + fileUrl} /> : <img className='h-32 w-full rounded-lg object-cover' src={BASE_URL + data.avatar} />}
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
