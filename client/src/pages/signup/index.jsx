import React, { useState } from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [mqttUsername, setMqttUsername] = useState('');
    const [aioKey, setAioKey] = useState('');
    const navigate = useNavigate();
    const handleRegister = async () => { 
        try {
            if (username==''){
                alert("Username không được để trống!")
            }
            else if (password==''){
                alert("Password không được để trống!")
            }
            else if (mqttUsername=='') {
                alert("mqttUsername không được để trống!")
            }
            else if (aioKey=='') {
                alert("aioKey không được để trống!")
            }
            else if (password != rePassword){
                alert('Mật khẩu không khớp!');
            }
            else{
                const registerResponse = await axios.post('http://localhost:3001/register',{username: username,password: password,mqttUsername: mqttUsername,aioKey: aioKey});
                if (registerResponse.data.data=="Register successfully"){
                    alert('Đăng ký thành công!');
                    setTimeout(() => {
                        navigate('/login');
                    }, 100);
                }
            }
        }catch (error) {
            if (error.response.status == 400) {
                if (error.response.data.error=="Account existed"){
                    alert("Tài khoản đã tồn tại!")
                }
                else{
                    alert('400: Bad request');
                }
            }
            else{
                alert(error);
            }
        }
    };
    return (
        <div className="min-h-screen h-screen bg-cover flex items-center justify-center" style={{backgroundImage: `url(${loginBackground})`, backgroundPosition: 'center bottom'}}>
            <div className="w-4/12 bg-white lg:h-[675px] 2xl:h-[695px] rounded-xl p-8 flex flex-col justify-center items-center">
                <p className="font-semibold text-center text-xl pt-2">Đăng ký</p>
                <div className="mt-8 w-2/3">
                    <p className="font-semibold">Username</p>
                    <input type="text" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" required placeholder="" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Password</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" required placeholder="" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Re-enter password</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" required placeholder="" value={rePassword} onChange={(e) => setRePassword(e.target.value)}/>
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">Adafruit username</p>
                    <input type="text" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" required placeholder="" value={mqttUsername} onChange={(e) => setMqttUsername(e.target.value)}/>
                </div>
                <div className="mt-4 w-2/3">
                    <p className="font-semibold">AioKey</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" required placeholder="" value={aioKey} onChange={(e) => setAioKey(e.target.value)}/>
                </div>
                <div className="mt-6 w-2/3">
                    <button className="w-full bg-sky-600 text-white py-1 px-4 rounded-xl hover:bg-sky-700 font-semibold" onClick={handleRegister}>Đăng ký</button>
                </div>
                <div className="mt-2 w-full text-center">
                    <p className="inline-block">Đã có tài khoản,&nbsp;</p>
                    <a href="" className="text-sky-500 underline hover:text-sky-700"  onClick={() => navigate('/login')}>Đăng nhập tại đây</a>    
                </div>
            </div>
        </div>
    );      
}
