import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../../layout/DefaultLayout'
import Breadcrumb from '../../../../components/Breadcrumb'

import TreeListView from './TreeList';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteWithToken, GetWithToken, PostWithToken, PutWithToken } from '../../../../app/api/apiMethod';
import { fetchMenuByRole } from '../../../../app/reducer/menu/menuReducer';
import { Table, Pagination, Checkbox, Button } from 'semantic-ui-react';
import ReactLoading from 'react-loading';
import { Icon } from 'semantic-ui-react'
import GroupMenuEdit from './GroupMenuEdit';
import { toast } from 'react-toastify';
import GroupMenuDelete from './GroupMenuDelete';
import GroupMenuInsert from './GroupMenuInsert';

// import TreeView from './TreeList'

export default function GroupMenu() {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const AppToken = useSelector(state => state.user.token);

    const InitMenu = () => {
        GetWithToken({ url: `/api/Menu/GetAll`, token: AppToken })
            .then(rs => {
                if (rs.status == 200) {
                    setLoading(false);
                    setMenu(rs.data.data);

                }
            })
    }
    useEffect(() => {
        InitMenu();
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
    const submitInsert = ({ data }) => {
        try {
            PostWithToken({ url: `/api/Menu/`, body: data })
                .then(rs => {
                    if (rs.status == 200) {
                        toast.success('Thêm menu thành công');
                        InitMenu();
                    }
                });


            setOpenInsert(false);
        } catch (error) {
            console.log(error);
            toast.error('Thêm menu thất bại')
        }
    }
    const submitEdit = ({ data }) => {
        try {
            PutWithToken({ url: `/api/Menu/${data.id}`, body: data })
                .then(rs => {
                    if (rs.status == 200) {
                        toast.success('Cập nhật menu thành công');
                        InitMenu();
                    }
                });


            setOpenEdit(false);
        } catch (error) {
            console.log(error);
            toast.error('Cập nhật menu thất bại')
        }
    }
    const submitDelete = (id) => {
        try {
            DeleteWithToken({ url: `/api/Menu/${id}` }).then(rs => {
                if (rs.status == 200) {
                    toast.success('Xoá menu thành công');
                    InitMenu();
                    setOpenEdit(false);
                }
            })
        } catch (error) {

            toast.error('Xoá menu thất bại')
        }
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Nhóm menu" />
            {
                loading == true ? <div className="flex  w-full justify-center items-center">
                    <ReactLoading type='spin' height={80} width={80} color='#5856d6' />
                </div> :
                    <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-row justify-center items-start'>
                        <div className="flex flex-col w-full sm:w-1/3 md:w-1/4 h-full p-8 ">
                            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white">Cây menu</h3>
                            <div className="mt-12">
                                <TreeListView />
                            </div>
                        </div>
                        <div className="flex flex-col w-full sm:w-2/3 md:w-3/4 h-full p-8 ">
                            <h3 className='text-xl sm:text-2xl font-bold text-black dark:text-white'>Quản lý menu</h3>
                            <div className="flex flex-row justify-end">
                                <Button content="Thêm mới" color='blue' icon='plus' onClick={() => setOpenInsert(true)} />
                            </div>
                            <Table celled selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>STT</Table.HeaderCell>
                                        <Table.HeaderCell>Tên menu</Table.HeaderCell>
                                        <Table.HeaderCell>Icon</Table.HeaderCell>
                                        <Table.HeaderCell>Sử dụng</Table.HeaderCell>
                                        <Table.HeaderCell>Đường dẫn</Table.HeaderCell>
                                        <Table.HeaderCell>Là Menu con</Table.HeaderCell>
                                        <Table.HeaderCell>Thao tác</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        (menu).map((e, index) => {
                                            return (
                                                <Table.Row key={e.id} >
                                                    <Table.Cell>{index + 1}</Table.Cell>
                                                    <Table.Cell>{e.name}</Table.Cell>
                                                    <Table.Cell>{e.icon}</Table.Cell>
                                                    <Table.Cell><Checkbox checked={e.isActive} /></Table.Cell>
                                                    <Table.Cell>{e.path}</Table.Cell>
                                                    <Table.Cell><Checkbox checked={!(e.children.length > 0)} /></Table.Cell>
                                                    <Table.Cell>
                                                        <button className="p-2" onClick={() => handlerOpenEdit(e)}><Icon name='edit' color='green' /></button>
                                                        <button className="" onClick={() => handlerOpenDelete(e)}><Icon name='trash alternate' color='red' /></button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        })
                                    }


                                </Table.Body>
                            </Table>
                            {/* <div className="flex flex-row justify-end">
                                <Pagination
                                    boundaryRange={0}
                                    defaultActivePage={1}
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    siblingRange={1}
                                    totalPages={10}
                                />
                            </div> */}
                        </div>
                        {/* block for modal edit */}
                        {
                            openEdit == true ? <GroupMenuEdit open={openEdit} onClose={() => setOpenEdit(false)} submit={submitEdit} data={dataSelected} /> : <></>

                        }
                        {
                            openDelete == true ? <GroupMenuDelete open={openDelete} onClose={() => setOpenDelete(false)} submitDelete={submitDelete} data={dataSelected} /> : <></>

                        }
                        {
                            openInsert == true ? <GroupMenuInsert open={openInsert} onClose={() => setOpenInsert(false)} submit={submitInsert} /> : <></>

                        }
                    </div>
            }


        </DefaultLayout>

    )
}
