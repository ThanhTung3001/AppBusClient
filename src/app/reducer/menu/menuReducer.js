import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { GetNotUseToken, GetWithToken } from "../../api/apiMethod"
import { initRequest } from "../../../Share/actionShare";
import { toast } from "react-toastify";

const initialState = {
    menu: [],
    loading: false
}

export const fetchMenuByRole = createAsyncThunk('fetchUser/OrderByRole', async ({ token }) => {
    var { data } = await GetWithToken({ url: `/api/Menu`, token });
    return data;
})

const menuSlice = createSlice({
    name: 'menu/slice',
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder => {
        builder.addCase(fetchMenuByRole.pending, initRequest)
        builder.addCase(fetchMenuByRole.fulfilled, (state, action) => {

            state.menu = action.payload.data;
            state.loading = false;

        })
        builder.addCase(fetchMenuByRole.rejected, (state, action) => {
            //   state.menu = action.payload.data;
            state.loading = false;
            toast.error('Load menu fail')
        })
    })
})

export default menuSlice.reducer;