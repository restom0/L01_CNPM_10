import React, { useState } from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LanguageSwitcher from '../../components/languageSwitcher';
import { useI18n } from '../../i18n';
import { DUMMY_ADMIN } from '../../data/dummyData';
import { classes } from '../../styles/classes';
import { getTranslatedApiErrorMessage } from '../../utils/apiError';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useI18n();
    const demoPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD;
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 3);
    const handleLogin = async () => { 
        try {
            if (username === ''){
                alert(t('error.usernameRequired'))
            }
            else if (password === ''){
                alert(t('error.passwordRequired'))
            }
            else if (demoPassword && username === DUMMY_ADMIN.username && password === demoPassword) {
                localStorage.setItem('sessionID', DUMMY_ADMIN.token);
                navigate('/dashboard');
            }
            else {
                await axios.post(`http://localhost:3001/login`, { username, password });
                // The JWT is set by the server in an httpOnly cookie; keep only a
                // non-sensitive marker so client-side route guards know we're in.
                localStorage.setItem('sessionID', 'authenticated');
                navigate('/dashboard');
            }
        }catch (error) {
            if (error.response?.status === 400) {
                alert(t('error.badRequest'));
            }
            else if (error.response?.data?.error === 'Username or password is incorrect'){
                alert(t('error.invalidLogin'))
            }
            else {
                alert(getTranslatedApiErrorMessage(t, error));
            }
        }
    };
    const navigate = useNavigate();
    return (
        <div className={classes.authShell} style={{backgroundImage: `url(${loginBackground})`, backgroundPosition: 'center bottom'}}>
            <div className="absolute right-[var(--spacing-section)] top-[var(--spacing-section)]">
                <LanguageSwitcher />
            </div>
            <div className={`${classes.authCard} h-2/3`}>
                <p className="font-semibold text-center text-xl pt-[var(--spacing-x)]">{t('auth.loginIntro')}</p>
                <div className="mt-[var(--spacing-section)] w-2/3">
                    <p className="font-semibold">{t('auth.username')}</p>
                    <input type="text" className={classes.authField} value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mt-[var(--spacing-y)] w-2/3">
                    <p className="font-semibold">{t('auth.password')}</p>
                    <input type="password" className={classes.authField} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mt-[var(--spacing-section)] w-2/3">
                    <button className={classes.authSubmitButton} onClick={handleLogin}>{t('auth.login')}</button>
                </div>
                <div className="mt-[var(--spacing-x)] w-2/3 text-center">
                    <p className="inline-block">{t('auth.noAccount')}&nbsp;</p>
                    <button type="button" className={classes.textLinkButton} onClick={() => navigate('/signup')}>{t('auth.signupHere')}</button>
                </div>
            </div>
        </div>
    );      
}
