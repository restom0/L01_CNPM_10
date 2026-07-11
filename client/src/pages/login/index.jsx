import React, { useState } from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LanguageSwitcher from '../../components/languageSwitcher';
import { useI18n } from '../../i18n';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useI18n();
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 3);
    const handleLogin = async () => { 
        try {
            if (username==''){
                alert(t('error.usernameRequired'))
            }
            else if (password==''){
                alert(t('error.passwordRequired'))
            }
            else {
                const loginResponse = await axios.post(`http://localhost:3001/login`,{username: username,password: password});
                localStorage.setItem('sessionID', loginResponse.data.api_token);
                navigate('/dashboard');
            }
        }catch (error) {
            if (error.response?.status == 400) {
                alert(t('error.badRequest'));
            }
            else if (error.response?.data?.error=='Username or password is incorrect'){
                alert(t('error.invalidLogin'))
            }
            else {
                alert(error.response?.data?.error || error.message);
            }
        }
    };
    const navigate = useNavigate();
    return (
        <div className="relative min-h-screen h-screen bg-cover flex items-center justify-center" style={{backgroundImage: `url(${loginBackground})`, backgroundPosition: 'center bottom'}}>
            <div className="absolute right-[var(--spacing-section)] top-[var(--spacing-section)]">
                <LanguageSwitcher />
            </div>
            <div className="w-4/12 bg-white h-2/3 rounded-xl p-[var(--spacing-section)] flex flex-col justify-center items-center">
                <p className="font-semibold text-center text-xl pt-[var(--spacing-x)]">{t('auth.loginIntro')}</p>
                <div className="mt-[var(--spacing-section)] w-2/3">
                    <p className="font-semibold">{t('auth.username')}</p>
                    <input type="text" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mt-[var(--spacing-y)] w-2/3">
                    <p className="font-semibold">{t('auth.password')}</p>
                    <input type="password" className="w-full px-4 py-2 border-none rounded-2xl bg-gray-100" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mt-[var(--spacing-section)] w-2/3">
                    <button className="w-full min-h-[44px] bg-sky-600 text-white py-1 px-4 rounded-xl hover:bg-sky-700 font-semibold" onClick={handleLogin}>{t('auth.login')}</button>
                </div>
                <div className="mt-[var(--spacing-x)] w-2/3 text-center">
                    <p className="inline-block">{t('auth.noAccount')}&nbsp;</p>
                    <button type="button" className="text-sky-500 underline hover:text-sky-700" onClick={() => navigate('/signup')}>{t('auth.signupHere')}</button>
                </div>
            </div>
        </div>
    );      
}
