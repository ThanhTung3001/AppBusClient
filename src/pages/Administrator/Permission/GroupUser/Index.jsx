import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../../layout/DefaultLayout'
import Breadcrumb from '../../../../components/Breadcrumb'

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteWithToken, GetWithToken, PostWithToken, PutWithToken } from '../../../../app/api/apiMethod';
// import { fetchUserByUser } from '../../../../app/reducer/User/UserReducer';
import { Table, Pagination, Checkbox, Button } from 'semantic-ui-react';
import ReactLoading from 'react-loading';
import { Icon } from 'semantic-ui-react'
import GroupUserEdit from './GroupUserEdit';
import { toast } from 'react-toastify';
import GroupUserDelete from './GroupUserDelete';
import { GroupUserInsert } from './GroupUserInsert';
// import GroupUserInsert from './GroupUserInsert';
// import GroupUserInsert from './GroupUserInsert';

// import TreeView from './TreeList'

export default function GroupUser() {
    const [User, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const AppToken = useSelector(state => state.user.token);

    const InitUser = () => {
        GetWithToken({ url: `/api/User`, token: AppToken })
            .then(rs => {
                if (rs.status == 200) {
                    setLoading(false);
                    setUser(rs.data.data);

                }
            })
    }
    useEffect(() => {
        InitUser();
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
            PostWithToken({ url: `/api/User/`, body: data })
                .then(rs => {
                    if (rs.status == 200) {
                        toast.success('Thêm User thành công');
                        InitUser();
                    }
                });


            setOpenInsert(false);
        } catch (error) {
            console.log(error);
            toast.error('Thêm User thất bại')
        }
    }
    const submitEdit = ({ data }) => {
        try {
            PutWithToken({ url: `/api/User/${data.id}`, body: data })
                .then(rs => {
                    if (rs.status == 200) {
                        toast.success('Cập nhật User thành công');
                        InitUser();
                    }
                });


            setOpenEdit(false);
        } catch (error) {
            console.log(error);
            toast.error('Cập nhật User thất bại')
        }
    }
    const submitDelete = (id) => {
        try {
            DeleteWithToken({ url: `/api/User/${id}` }).then(rs => {
                if (rs.status == 200) {
                    toast.success('Xoá User thành công');
                    InitUser();
                    setOpenEdit(false);
                }
            })
        } catch (error) {

            toast.error('Xoá User thất bại')
        }
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Nhóm vai trò" />
            {
                loading == true ? <div className="flex  w-full justify-center items-center">
                    <ReactLoading type='spin' height={80} width={80} color='#5856d6' />
                </div> :
                    <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-row justify-center items-start'>

                        <div className="flex flex-col w-full h-full p-8 ">
                            <h3 className='text-xl sm:text-2xl font-bold text-black dark:text-white'>Quản lý User</h3>
                            <div className="flex flex-row justify-end">
                                <Button content="Thêm mới" color='blue' icon='plus' onClick={() => setOpenInsert(true)} />
                            </div>
                            <Table celled selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>STT</Table.HeaderCell>
                                        <Table.HeaderCell>Tên vai trò</Table.HeaderCell>
                                        <Table.HeaderCell>Menu được phân quyền</Table.HeaderCell>
                                        <Table.HeaderCell>Thao tác</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        (User).map((e, index) => {
                                            return (
                                                <Table.Row key={e.id} >
                                                    <Table.Cell>{index + 1}</Table.Cell>
                                                    <Table.Cell>{e.name}</Table.Cell>
                                                    <Table.Cell>{e.menuUsers.map(e => e?.menu?.name).join(', ')}</Table.Cell>
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
                            openEdit == true ? <GroupUserEdit open={openEdit} onClose={() => setOpenEdit(false)} submit={submitEdit} data={dataSelected} /> : <></>

                        }
                        {
                            openDelete == true ? <GroupUserDelete open={openDelete} onClose={() => setOpenDelete(false)} submitDelete={submitDelete} data={dataSelected} /> : <></>

                        }
                        {
                            openInsert == true ? <GroupUserInsert open={openInsert} onClose={() => setOpenInsert(false)} submit={submitInsert} /> : <></>

                        }
                    </div>
            }


        </DefaultLayout>

    )
}
