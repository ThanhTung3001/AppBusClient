import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../../components/Breadcrumb'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteWithToken, GetWithToken, PostFileWithToken, PostWithToken, PutWithToken } from '../../../app/api/apiMethod';
import { fetchMenuByRole } from '../../../app/reducer/menu/menuReducer';
import { Table, Pagination, Checkbox, Button } from 'semantic-ui-react';
import ReactLoading from 'react-loading';
import { Icon } from 'semantic-ui-react'
import StrationEdit from './StationEdit';
import { toast } from 'react-toastify';
import StrationDelete from './StationDelete';
import StrationInsert from './StationInsert';
import moment from 'moment';
import { BASE_URL } from '../../../constance/AppUrl';

// import TreeView from './TreeList'

export default function Station() {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const AppToken = useSelector(state => state.user.token);

    const InitMenu = ({ pageNumber = 1, pageSize = 10 }) => {
        GetWithToken({
            url: `/api/Station?PageSize=${pageSize}&PageNumber=${pageNumber}`, token: AppToken
        })
            .then(rs => {
                if (rs.status == 200) {
                    setLoading(false);
                    setMenu(rs.data);
                    console.log(rs.data);
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
                url: `/api/Stration`, body: data
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
            toast.error('Thêm mới trạm xảy ra lỗi')
        }
    }
    const submitEdit = ({ data, file }) => {

        try {

            PutWithToken({
                url: `/api/Stration/${dataSelected.id}`, body: data
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
            toast.error('Cập nhật trạm xảy ra lỗi')
        }
        setOpenEdit(false);

    }
    const submitDelete = (id) => {
        try {
            DeleteWithToken({ url: `/api/Stration/${id}` }).then(rs => {
                if (rs.status == 200) {
                    toast.success('Xoá phương tiện thành công');
                    InitMenu();
                    setOpenDelete(false);
                }
            })
        } catch (error) {

            toast.error('Xoá trạm thất bại')
        }
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Trạm" />
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
                                        <Table.HeaderCell>Mã trạm</Table.HeaderCell>
                                        <Table.HeaderCell>Tên trạm</Table.HeaderCell>
                                        <Table.HeaderCell>Mô tả</Table.HeaderCell>
                                        <Table.HeaderCell>Vị trí</Table.HeaderCell>
                                        <Table.HeaderCell>Địa chỉ</Table.HeaderCell>
                                        <Table.HeaderCell>Ảnh đại diện</Table.HeaderCell>
                                        <Table.HeaderCell>Sử dụng</Table.HeaderCell>
                                        <Table.HeaderCell>Thao tác</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        (menu.data).map((e, index) => {
                                            return (
                                                <Table.Row key={e.id} >
                                                    <Table.Cell>{(index) + 1}</Table.Cell>
                                                    <Table.Cell>{e.code}</Table.Cell>
                                                    <Table.Cell>{e.name}</Table.Cell>
                                                    <Table.Cell>{e.description}</Table.Cell>
                                                    <Table.Cell>{`Lat: ${e.lat} - Long: ${e.long}`}</Table.Cell>
                                                    <Table.Cell>{e.addresss}</Table.Cell>
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
                            openEdit == true ? <StrationEdit open={openEdit} onClose={() => setOpenEdit(false)} submit={submitEdit} data={dataSelected} /> : <></>

                        }
                        {
                            openDelete == true ? <StrationDelete open={openDelete} onClose={() => setOpenDelete(false)} submitDelete={submitDelete} data={dataSelected} /> : <></>

                        }
                        {
                            openInsert == true ? <StrationInsert open={openInsert} onClose={() => setOpenInsert(false)} submit={submitInsert} /> : <></>

                        }
                    </div>
            }


        </DefaultLayout>

    )
}
