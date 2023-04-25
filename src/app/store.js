import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux';
import user from './reducer/user/userReducer';
import menuReducer from './reducer/menu/menuReducer';

// const reducer = combineReducers({
//     // here we will be adding reducers
//     user
// })
const store = configureStore({
    reducer: {
        user: user,
        menu: menuReducer
    }
})
export default store;