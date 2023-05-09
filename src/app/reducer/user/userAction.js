import { useNavigate } from "react-router-dom";
import { storeTokenInCookie } from "../../../Share/storedToken";
import { TYPE_AUTH } from "../../../constance/AppUrl";
import { ROLE_TYPE } from "../../../constance/roleType";


export const loginFullFill = (state, action) => {
    // console.log(action);
    //var navigate = useNavigate();
    var response = action.payload;
    state.user = response.data;
    state.token = TYPE_AUTH + response.data.jwToken;
    state.auth = true;
    state.roles = response.data.roles;
    console.log(TYPE_AUTH + response.data.jwToken);
    storeTokenInCookie(TYPE_AUTH + response.data.jwToken);
    localStorage.setItem('User', JSON.stringify(response.data));
    // localStorage.setItem('token',)
    if (response.data.roles.includes(ROLE_TYPE.Administrator)) {
        // console.log("User has Administrator role.");
        window.location.href = "/admin";
    } else {
        window.location.href = '/';
    }

}