import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../../layout/DefaultLayout'
import Breadcrumb from '../../../../components/Breadcrumb'

import TreeListView from './TreeList';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { GetWithToken } from '../../../../app/api/apiMethod';
import { fetchMenuByRole } from '../../../../app/reducer/menu/menuReducer';
// import TreeView from './TreeList'

export default function GroupMenu() {


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Nhóm menu" />
            <div className='rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-[100vh] flex flex-col justify-center items-start'>
                <div className="flex flex-col w-full sm:w-1/2 md:w-1/3 h-full p-8 ">
                    <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white">Cây menu</h3>
                    <div className="mt-12">
                        <TreeListView />
                    </div>
                </div>
            </div>

        </DefaultLayout>

    )
}
