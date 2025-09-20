import axios from "axios";

const BASE_URL = ' https://7f10cde4052c.ngrok-free.app/api';

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

export const getDashboard = async (token:string)=>{
    const res = await api.get('/interviews/dashboard',{
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export const createSession = async (token: string, formData: FormData) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data", 
  };

  const res = await api.post("/interviews/create-session", formData, { headers });
  return res.data;
};

export const getQuestions = async (token:string ,sessionId: number) =>{
  const res =await api.get(`${BASE_URL}/interviews/questions/${sessionId}`,{
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const SubmitAnswer = async (token:string , questionId:number , answer:string)=>{
  const res = await api.post(`${BASE_URL}/interviews/questions/${questionId}/answer`,{ answer },{
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const Score = async (token:string , sessionId:number)=>{
  const res = await api.get(`${BASE_URL}/interviews/session/${sessionId}/score`,{
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data;
}

export const dashboard_session = async (token:string , sessionId:number)=>{
  const res = await api.get(`${BASE_URL}/interviews/sessions/${sessionId}/dashboard`,{
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data;
}