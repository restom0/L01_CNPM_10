import React, { useState, useEffect } from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 3);
    const handleLogin = async () => { 
        try {
            const loginResponse = await axios.post(`http://localhost:3001/login`,{username: username,password: password});
            cookies.set('sessionID', loginResponse.data.api_token, { expires: expiresDate });
            navigate('/dashboard');
        }catch (error) {
            console.error("Error fetching data:", error);
            alert('Sai tài khoản hoặc mật khẩu!');
        }
    };
    const navigate = useNavigate();
    return (
        <div className="min-h-screen h-screen bg-cover flex items-center justify-center" style={{backgroundImage: `url(${loginBackground})`, backgroundPosition: 'center bottom'}}>
            <div className="w-4/12 bg-white h-2/3 rounded-xl p-8 flex flex-col justify-center items-center">
                <p className="font-semibold text-center text-xl pt-2">Nhập username và password để đăng nhập</p>
                <div className="mt-8 w-2/3">
                    <p className="font-semibold">Username</p>
                    <input type="text" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Password</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mt-6 w-2/3">
                    <button className="w-full bg-sky-600 text-white py-1 px-4 rounded-xl hover:bg-sky-700 font-semibold" onClick={handleLogin}>Đăng nhập</button>
                </div>
                <div className="mt-2 w-2/3 text-center">
                    <p className="inline-block">Chưa có tài khoản,&nbsp;</p>
                    <a href="" className="text-sky-500 underline hover:text-sky-700"  onClick={() => navigate('/signup')}>Đăng ký tại đây</a>
                </div>
            </div>
        </div>
    );      
}