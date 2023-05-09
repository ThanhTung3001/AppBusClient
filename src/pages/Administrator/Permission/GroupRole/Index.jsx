import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../../layout/DefaultLayout'
import Breadcrumb from '../../../../components/Breadcrumb'

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteWithToken, GetWithToken, PostWithToken, PutWithToken } from '../../../../app/api/apiMethod';
// import { fetchroleByRole } from '../../../../app/reducer/role/roleReducer';
import { Table, Pagination, Checkbox, Button } from 'semantic-ui-react';
import ReactLoading from 'react-loading';
import { Icon } from 'semantic-ui-react'
import GroupRoleEdit from './GroupRoleEdit';
import { toast } from 'react-toastify';
import GroupRoleDelete from './GroupRoleDelete';
import { GroupRoleInsert } from './GroupRoleInsert';
// import GroupRoleInsert from './GroupRoleInsert';
// import GroupRoleInsert from './GroupRoleInsert';

// import TreeView from './TreeList'

export default function GroupRole() {
    const [role, setRole] = useState({});
    const [loading, setLoading] = useState(true);
    const AppToken = useSelector(state => state.user.token);

    const InitRole = () => {
        GetWithToken({ url: `/api/role`, token: AppToken })
            .then(rs => {
                if (rs.status == 200) {
                    setLoading(false);
                    setRole(rs.data.data);

                }
            })
    }
    useEffect(() => {
        InitRole();
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
            PostWithToken({ url: `/api/role/`, body: data })
                .then(rs => {
                    if (rs.status == 200) {
                        toast.success('Thêm role thành công');
                        InitRole();
                    }
                });


            setOpenInsert(false);
        } catch (error) {
            console.log(error);
            toast.error('Thêm role thất bại')
        }
    }
    const submitEdit = ({ data }) => {
        try {
            PutWithToken({ url: `/api/role/${data.id}`, body: data })
                .then(rs => {
                    if (rs.status == 200) {
                        toast.success('Cập nhật role thành công');
                        InitRole();
                    }
                });


            setOpenEdit(false);
        } catch (error) {
            console.log(error);
            toast.error('Cập nhật role thất bại')
        }
    }
    const submitDelete = (id) => {
        try {
            DeleteWithToken({ url: `/api/role/${id}` }).then(rs => {
                if (rs.status == 200) {
                    toast.success('Xoá role thành công');
                    InitRole();
                    setOpenEdit(false);
                }
            })
        } catch (error) {

            toast.error('Xoá role thất bại')
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
                            <h3 className='text-xl sm:text-2xl font-bold text-black dark:text-white'>Quản lý role</h3>
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
                                        (role).map((e, index) => {
                                            return (
                                                <Table.Row key={e.id} >
                                                    <Table.Cell>{index + 1}</Table.Cell>
                                                    <Table.Cell>{e.name}</Table.Cell>
                                                    <Table.Cell>{e.menuRoles.map(e => e?.menu?.name).join(', ')}</Table.Cell>
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
                            openEdit == true ? <GroupRoleEdit open={openEdit} onClose={() => setOpenEdit(false)} submit={submitEdit} data={dataSelected} /> : <></>

                        }
                        {
                            openDelete == true ? <GroupRoleDelete open={openDelete} onClose={() => setOpenDelete(false)} submitDelete={submitDelete} data={dataSelected} /> : <></>

                        }
                        {
                            openInsert == true ? <GroupRoleInsert open={openInsert} onClose={() => setOpenInsert(false)} submit={submitInsert} /> : <></>

                        }
                    </div>
            }


        </DefaultLayout>

    )
}
