import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { PostNotUseToken, PostWithToken } from "../../api/apiMethod"
import { LOGIN_API } from "../../../constance/AppUrl";
import { initRequest } from "../../../Share/actionShare";
import { loginFullFill } from "./userAction";
import { clearTokenFromCookie, getTokenFromCookie } from "../../../Share/storedToken";
import { toast } from "react-toastify";



const initialState = {
    user: {},
    token: '',
    loading: false,
    error: false,
    message: '',
    auth: false,
    roles: [],
    primaryRole: ""
}


export const loginAsync = createAsyncThunk('user/loginAsync', async ({ email, password }) => {

    var { data } = await PostNotUseToken({ url: LOGIN_API, body: { email: email, password } });
    return data;
})


const userSlice = createSlice({
    name: 'user/userSlice',
    initialState: initialState,
    reducers: {
        logout: (state, action) => {
            clearTokenFromCookie();
            state.user = {};
            state.auth = false;
            state.token = '';
        },
        initToken: (state, action) => {
            if (getTokenFromCookie() != '') {

                state.token = getTokenFromCookie();
                var user = JSON.parse(localStorage.getItem('User'));
                state.user = user;
                state.auth = true;
                state.primaryRole = '';

                // console.log(user);
            }

        }
    },
    extraReducers: (builder => {
        builder.addCase(loginAsync.pending, initRequest)
        builder.addCase(loginAsync.fulfilled, loginFullFill)
        builder.addCase(loginAsync.rejected, (state, action) => {
            state.error = true;
            toast.error("Email hoặc mật khẩu không chính xác")
        })
    })
});

export default userSlice.reducer;

export const { logout, initToken } = userSlice.actions