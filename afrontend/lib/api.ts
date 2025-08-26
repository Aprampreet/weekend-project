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

export const getProfile = async (token: string) => {
  const res = await api.get('/users/profile', { headers: { Authorization: `Bearer ${token}` } });
  const data = res.data;

  if (data.profile_pic && !data.profile_pic.startsWith('http')) {
    data.profile_pic = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${data.profile_pic}`;
  }

  return data;
}


export const updateProfile = async (token:string , data: { full_name?: string; bio?: string; country?: string; mobile?: string },file?: File) =>{
    const formData = new FormData();
    Object.entries(data).forEach(([key,value])=>{
        if(value !== undefined && value !== null ) formData.append(key , value)
})
    if (file) formData.append('profile_pic',file)
    const res = await api.post('/users/profile/update',formData ,{
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    })
    return res.data;

}
