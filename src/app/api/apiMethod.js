import axios from "axios";
import { useSelector } from "react-redux"
import { BASE_URL } from "../../constance/AppUrl";
import { getTokenFromCookie } from "../../Share/storedToken";


export const PostNotUseToken = async ({ url, body }) => {
    // const token = useSelector(state=>state.SignUp.token);

    try {
        var response = await axios.post(`${BASE_URL}${url}`, body);
        return response;
    } catch (error) {
        throw error;
    }
}
export const GetNotUseToken = async ({ url }) => {
    // const token = useSelector(state=>state.SignUp.token);
    var response = await axios.get(`${BASE_URL}${url}`);
    return response;
}

export const PostWithToken = async ({ url, body, token = getTokenFromCookie() }) => {
    // const token = useSelector(state=>state.SignUp.token);
    var response = await axios.post(`${BASE_URL}${url}`, body, {
        headers: {
            'Authorization': token
        },

    });
    return response;
}
export const PutWithToken = async ({ url, body, token = getTokenFromCookie() }) => {

    // const appToken = useSelector(state=>state.SignUp.token);
    var response = await axios.put(`${BASE_URL}${url}`, body, {
        headers: {
            'Authorization': token,
        },
    });
    return response;
}
export const GetWithToken = async ({ url, token = getTokenFromCookie() }) => {
    //  const token = useSelector(state=>state.SignUp.token);
    // console.log(token);
    // const token = getTokenFromCookie();
    var urls = `${BASE_URL}${url}`;
    // console.log({ urls, token });
    var response = await axios.get(urls, {
        headers: {
            'Authorization': token
        }
    });

    return response;
}
export const PatchWithToken = async ({ url, body, token }) => {
    //  const token = useSelector(state=>state.SignUp.token);
    // console.log(token);
    var response = await axios.patch(`${BASE_URL}${url}`, body, {
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
    });
    //  console.log(response);

    return response;
}

export const DeleteWithToken = async ({ url, body, token = getTokenFromCookie() }) => {
    //  const token = useSelector(state=>state.SignUp.token);
    console.log(token);
    var response = await axios.delete(`${BASE_URL}${url}`, {
        headers: {
            'Authorization': token,
        },
    });
    //  console.log(response);

    return response;
}

export const PostFileWithToken = async ({ url, token = getTokenFromCookie(), file }) => {

    var data = new FormData()
    data.append('file', file, file.name);
    var response = await axios.post(`${BASE_URL}${url}`, data, {
        headers: {
            'Authorization': token,
            "Content-Type": "multipart/form-data"
        },
    });
    return response;
}