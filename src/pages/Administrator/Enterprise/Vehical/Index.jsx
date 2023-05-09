import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../../layout/DefaultLayout'
import Breadcrumb from '../../../../components/Breadcrumb'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteWithToken, GetWithToken, PostFileWithToken, PostWithToken, PutWithToken } from '../../../../app/api/apiMethod';
import { fetchMenuByRole } from '../../../../app/reducer/menu/menuReducer';
import { Table, Pagination, Checkbox, Button } from 'semantic-ui-react';
import ReactLoading from 'react-loading';
import { Icon } from 'semantic-ui-react'
import VehicalEdit from './VehicalEdit';
import { toast } from 'react-toastify';
import VehicalDelete from './VehicalDelete';
import VehicalInsert from './VehicalInsert';
import moment from 'moment';
import { BASE_URL } from '../../../../constance/AppUrl';

// import TreeView from './TreeList'

export default function Vehical() {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const AppToken = useSelector(state => state.user.token);

    const InitMenu = ({ pageNumber = 1, pageSize = 10 }) => {
        GetWithToken({
            url: `/api/Vehical/GetAllByName?PageSize=${pageSize}&PageNumber=${pageNumber}`, token: AppToken
        })
            .then(rs => {
                if (rs.status == 200) {
                    setLoading(false);
                    setMenu(rs.data);
                    //  console.log(menu);
                }
            })
    }
    useEffect(() => {
        InitMenu({ pageNumber: 1, pageSize: 10 });
    }, []);
    const [dataSelected, setDataSelected] = useState({});
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openInsert, setOpenInsert] = useState(false);
    const handlerOpenEdit = (data) => {
        setDataSelected(data);
        setOpenEdit(true);

    }
    const handlerOpenDelete = (data) => {
        setDataSelected(data);
        setOpenDelete(true);

    }
    const handleChangePage = (event, page) => {

        InitMenu({ pageNumber: page.activePage, pageSize: 10 });
    }
    const submitInsert = ({ data, file }) => {
        try {

            PostWithToken({
                url: `/api/Vehical`, body: data
            })
                .then(rs => {
                    // console.log(rs.status);
                    if (rs.status == 201) {
                        toast.success('Thêm mới thành công');
                        InitMenu({ pageNumber: 1, pageSize: 10 });
                        setOpenInsert(false);
                    }
                });

            // setOpenInsert(false);

            console.log({ data, file });
        } catch (error) {
            console.log(error);
            toast.error('Thêm mới phương tiện xảy ra lỗi')
        }
    }
    const submitEdit = ({ data, file }) => {

        try {

            PutWithToken({
                url: `/api/Vehical/${dataSelected.id}`, body: data
            })
                .then(rs => {
                    console.log(rs.status);
                    if (rs.status == 200) {
                        toast.success('Cập nhật thành công');
                        InitMenu({ pageNumber: 1, pageSize: 10 });
                        setOpenInsert(false);
                    }
                });

            // setOpenInsert(false);


        } catch (error) {
            console.log(error);
            toast.error('Cập nhật doanh nghiệp xảy ra lỗi')
        }
        setOpenEdit(false);

    }
    const submitDelete = (id) => {
        try {
            DeleteWithToken({ url: `/api/Vehical/${id}` }).then(rs => {
                if (rs.status == 200) {
                    toast.success('Xoá phương tiện thành công');
                    InitMenu();
                    setOpenDelete(false);
                }
            })
        } catch (error) {

            toast.error('Xoá menu thất bại')
        }
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Phuơng tiện" />
            {
                loading == true ? <div className="flex  w-full justify-center items-center">
                    <ReactLoading type='spin' height={80} width={80} color='#5856d6' />
                </div> :
                    <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-row justify-center items-start'>

                        <div className="flex flex-col w-full h-full p-8 ">
                            <h3 className='text-xl sm:text-2xl font-bold text-black dark:text-white'>Quản lý phương tiện</h3>
                            <div className="flex flex-row justify-end">
                                <Button content="Thêm mới" color='blue' icon='plus' onClick={() => setOpenInsert(true)} />
                            </div>
                            <Table celled selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>STT</Table.HeaderCell>
                                        <Table.HeaderCell>Tên xe</Table.HeaderCell>
                                        <Table.HeaderCell>Biển số</Table.HeaderCell>
                                        <Table.HeaderCell>Số chổ ngồi</Table.HeaderCell>
                                        <Table.HeaderCell>Ngày bảo hành gần nhất</Table.HeaderCell>
                                        <Table.HeaderCell>Năm đăng ký</Table.HeaderCell>
                                        <Table.HeaderCell>Hạn đăng kiểm</Table.HeaderCell>
                                        <Table.HeaderCell>Thuộc doanh nghiệp</Table.HeaderCell>
                                        <Table.HeaderCell>Hình ảnh</Table.HeaderCell>
                                        <Table.HeaderCell>Đang vận hành</Table.HeaderCell>
                                        <Table.HeaderCell>Thao tác</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        (menu.data).map((e, index) => {
                                            return (
                                                <Table.Row key={e.id} >
                                                    <Table.Cell>{(index) + 1}</Table.Cell>
                                                    <Table.Cell>{e.model}</Table.Cell>
                                                    <Table.Cell>{e.plateNumber}</Table.Cell>
                                                    <Table.Cell>{e.numberOfSeats}</Table.Cell>
                                                    <Table.Cell>{moment(e.lastMaintenanceDate).format('DD/MM/YYYY')}</Table.Cell>
                                                    <Table.Cell className=''><p className='text-4line'>{(e.registrationYear)}</p></Table.Cell>
                                                    <Table.Cell>{moment(e.insuranceExpirationDate).format('DD/MM/YYYY')}</Table.Cell>
                                                    <Table.Cell className='w-80'>{e.organization?.name}</Table.Cell>
                                                    <Table.Cell><img src={BASE_URL + e.avatar} className='w-[100px] h-[100px] object-cover rounded-md' /></Table.Cell>
                                                    <Table.Cell><Checkbox checked={(e.isActive)} /></Table.Cell>
                                                    <Table.Cell className='min-w-22.5'>
                                                        <button className="p-2" onClick={() => handlerOpenEdit(e)}><Icon name='edit' color='green' /></button>
                                                        <button className="" onClick={() => handlerOpenDelete(e)}><Icon name='trash alternate' color='red' /></button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        })
                                    }


                                </Table.Body>
                            </Table>
                            {
                                menu != null ?
                                    <div className="flex flex-row justify-end">
                                        <Pagination
                                            boundaryRange={0}
                                            defaultActivePage={1}
                                            ellipsisItem={null}
                                            firstItem={null}
                                            lastItem={null}
                                            siblingRange={1}
                                            totalPages={menu?.totalPage}
                                            onPageChange={handleChangePage}
                                        />
                                    </div> : <></>
                            }
                        </div>
                        {/* block for modal edit */}
                        {
                            openEdit == true ? <VehicalEdit open={openEdit} onClose={() => setOpenEdit(false)} submit={submitEdit} data={dataSelected} /> : <></>

                        }
                        {
                            openDelete == true ? <VehicalDelete open={openDelete} onClose={() => setOpenDelete(false)} submitDelete={submitDelete} data={dataSelected} /> : <></>

                        }
                        {
                            openInsert == true ? <VehicalInsert open={openInsert} onClose={() => setOpenInsert(false)} submit={submitInsert} /> : <></>

                        }
                    </div>
            }


        </DefaultLayout>

    )
}
