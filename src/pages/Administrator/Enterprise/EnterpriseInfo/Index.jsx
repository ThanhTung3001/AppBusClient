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
import EnterpriseInfoEdit from './EnterpriseInfoEdit';
import { toast } from 'react-toastify';
import EnterpriseInfoDelete from './EnterpriseInfoDelete';
import EnterpriseInfoInsert from './EnterpriseInfoInsert';

// import TreeView from './TreeList'

export default function EnterpriseInfo() {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const AppToken = useSelector(state => state.user.token);

    const InitMenu = ({ pageNumber = 1, pageSize = 10 }) => {
        GetWithToken({
            url: `/api/Organization?PageSize=${pageSize}&PageNumber=${pageNumber}`, token: AppToken
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

            PostFileWithToken({ url: '/api/Attachment?savePath=uploads%2Favatars', file: file })
                .then(rs => {

                    if (rs.status == 200) {
                        var pathFile = rs.data?.pathFile;
                        data.avatar = pathFile;
                        PostWithToken({
                            url: `/api/Organization`, body: data
                        })
                            .then(rs => {
                                console.log(rs.status);
                                if (rs.status == 201) {
                                    toast.success('Thêm mới thành công');
                                    InitMenu({ pageNumber: 1, pageSize: 10 });
                                    setOpenInsert(false);
                                }
                            });
                    } else {
                        toast.error('Thêm mới người dùng xảy ra lỗi')
                    }
                })

            // setOpenInsert(false);

            console.log({ data, file });
        } catch (error) {
            console.log(error);
            toast.error('Thêm menu thất bại')
        }
    }
    const submitEdit = ({ data, file }) => {

        try {

            if (file != null) {
                PostFileWithToken({ url: '/api/Attachment?savePath=uploads%2Favatars', file: file })
                    .then(rs => {

                        if (rs.status == 200) {
                            var pathFile = rs.data?.pathFile;
                            data.avatar = pathFile;
                            PutWithToken({
                                url: `/api/Organization/${dataSelected.id}`, body: data
                            })
                                .then(rs => {
                                    console.log(rs.status);
                                    if (rs.status == 200) {
                                        toast.success('Cập nhật thành công');
                                        InitMenu({ pageNumber: 1, pageSize: 10 });
                                        setOpenInsert(false);
                                    }
                                });
                        } else {
                            toast.error('Cập nhật doanh nghiệp xảy ra lỗi')
                        }
                    })
            } else {
                PutWithToken({
                    url: `/api/Organization/${dataSelected.id}`, body: data
                })
                    .then(rs => {
                        console.log(rs.status);
                        if (rs.status == 200) {
                            toast.success('Cập nhật thành công');
                            InitMenu({ pageNumber: 1, pageSize: 10 });
                            setOpenInsert(false);
                        }
                    });
            }

            // setOpenInsert(false);


        } catch (error) {
            console.log(error);
            toast.error('Cập nhật doanh nghiệp xảy ra lỗi')
        }
        setOpenEdit(false);

    }
    const submitDelete = (id) => {
        try {
            DeleteWithToken({ url: `/api/Organization/${id}` }).then(rs => {
                if (rs.status == 200) {
                    toast.success('Xoá doanh nghiệp thành công');
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
            <Breadcrumb pageName="Doanh nghiệp" />
            {
                loading == true ? <div className="flex  w-full justify-center items-center">
                    <ReactLoading type='spin' height={80} width={80} color='#5856d6' />
                </div> :
                    <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-row justify-center items-start'>

                        <div className="flex flex-col w-full h-full p-8 ">
                            <h3 className='text-xl sm:text-2xl font-bold text-black dark:text-white'>Quản lý doanh nghiệp</h3>
                            <div className="flex flex-row justify-end">
                                <Button content="Thêm mới" color='blue' icon='plus' onClick={() => setOpenInsert(true)} />
                            </div>
                            <Table celled selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>STT</Table.HeaderCell>
                                        <Table.HeaderCell>Tên doanh nghiệp</Table.HeaderCell>
                                        <Table.HeaderCell>Mã số thuế</Table.HeaderCell>

                                        <Table.HeaderCell>Địa chỉ</Table.HeaderCell>
                                        <Table.HeaderCell>Số điện thoại</Table.HeaderCell>
                                        <Table.HeaderCell>Giới thiệu</Table.HeaderCell>
                                        <Table.HeaderCell>Website</Table.HeaderCell>
                                        <Table.HeaderCell>Hoạt động</Table.HeaderCell>
                                        <Table.HeaderCell>Thao tác</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        (menu.data).map((e, index) => {
                                            return (
                                                <Table.Row key={e.id} >
                                                    <Table.Cell>{(index) * 10 + 1}</Table.Cell>
                                                    <Table.Cell>{e.name}</Table.Cell>
                                                    <Table.Cell>{e.taxCode}</Table.Cell>
                                                    <Table.Cell>{e.address}</Table.Cell>
                                                    <Table.Cell>{e.phoneNumber}</Table.Cell>
                                                    <Table.Cell className='w-100'><p className='text-4line'>{e.introduction}</p></Table.Cell>
                                                    <Table.Cell>{e.webSiteAddress}</Table.Cell>
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
                            openEdit == true ? <EnterpriseInfoEdit open={openEdit} onClose={() => setOpenEdit(false)} submit={submitEdit} data={dataSelected} /> : <></>

                        }
                        {
                            openDelete == true ? <EnterpriseInfoDelete open={openDelete} onClose={() => setOpenDelete(false)} submitDelete={submitDelete} data={dataSelected} /> : <></>

                        }
                        {
                            openInsert == true ? <EnterpriseInfoInsert open={openInsert} onClose={() => setOpenInsert(false)} submit={submitInsert} /> : <></>

                        }
                    </div>
            }


        </DefaultLayout>

    )
}
