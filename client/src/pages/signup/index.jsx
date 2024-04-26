import React from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen h-screen bg-cover flex items-center justify-center" style={{backgroundImage: `url(${loginBackground})`, backgroundPosition: 'center bottom'}}>
            <div className="w-4/12 bg-white h-full rounded-xl p-8 flex flex-col justify-center items-center">
                <p className="font-semibold text-center text-xl pt-2">Đăng ký</p>
                <div className="mt-8 w-2/3">
                    <p className="font-semibold">Username</p>
                    <input type="text" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" />
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Password</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" />
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Re-enter password</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" />
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Adafruit username</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" />
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Fullname</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" />
                </div>
                <div className="mt-6 w-2/3">
                    <button className="w-full bg-sky-600 text-white py-1 px-4 rounded-xl hover:bg-sky-700 font-semibold">Đăng nhập</button>
                </div>
                <div className="mt-2 w-2/3 text-center">
                    <p className="inline-block">Đã có tài khoản,&nbsp;</p>
                    <a href="" className="text-sky-500 underline hover:text-sky-700"  onClick={() => navigate('/login')}>Đăng nhập tại đây</a>    
                </div>
            </div>
        </div>
    );      
}