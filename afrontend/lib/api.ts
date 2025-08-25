import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
    baseURL:BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

export const registerUser = async (data:{username:string ; email : string ; password : string}) => {
    const res = await api.post('/users/register', data);
    return res.data;
};


export const loginUser = async (data:{username:string ; password:string}) =>{
    const res = await api.post('/users/login',data)
    return res.data
}

export const getProfile = async(token:string) =>{
    const res = await api.get('/interviews/profile',{ headers: { Authorization: `Bearer ${token}` } })
    return res.data;
}