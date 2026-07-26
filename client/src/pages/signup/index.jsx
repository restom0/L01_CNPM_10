import React, { useState } from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../components/languageSwitcher';
import { useI18n } from '../../i18n';
import { classes } from '../../styles/classes';
import { getTranslatedApiErrorMessage } from '../../utils/apiError';
import { registerUser } from '../../services/apiService';

/**
 * Render signup page and submit account registration.
 *
 * @returns {JSX.Element} Signup page.
 */
export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [mqttUsername, setMqttUsername] = useState('');
    const [aioKey, setAioKey] = useState('');
    const navigate = useNavigate();
    const { t } = useI18n();
    /**
     * Return translation key for first validation error.
     *
     * @returns {string|null} Error translation key or null.
     */
    const getValidationErrorKey = () => {
        if (username === '') return 'error.usernameRequired';
        if (password === '') return 'error.passwordRequired';
        if (mqttUsername === '') return 'error.mqttUsernameRequired';
        if (aioKey === '') return 'error.aioKeyRequired';
        if (password !== rePassword) return 'error.passwordMismatch';
        return null;
    };
    /**
     * Validate form and register account through API.
     *
     * @returns {Promise<void>}
     */
    const handleRegister = async () => {
        const validationErrorKey = getValidationErrorKey();
        if (validationErrorKey) {
            alert(t(validationErrorKey));
            return;
        }
        try {
            const registerResponse = await registerUser(username, password, mqttUsername, aioKey);
            if (registerResponse.data.data === "Register successfully") {
                alert(t('register.success'));
                setTimeout(() => {
                    navigate('/login');
                }, 100);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                if (error.response?.data?.error === "Account existed") {
                    alert(t('error.accountExists'));
                } else {
                    alert(t('error.badRequest'));
                }
            } else {
                alert(getTranslatedApiErrorMessage(t, error));
            }
        }
    };
    return (
        <div className={classes.authShell} style={{backgroundImage: `url(${loginBackground})`, backgroundPosition: 'center bottom'}}>
            <div className="absolute right-[var(--spacing-section)] top-[var(--spacing-section)]">
                <LanguageSwitcher />
            </div>
            <div className={`${classes.authCard} lg:h-[675px] 2xl:h-[695px]`}>
                <p className="font-semibold text-center text-xl pt-[var(--spacing-x)]">{t('auth.signup')}</p>
                <div className="mt-[var(--spacing-section)] w-2/3">
                    <p className="font-semibold">{t('auth.username')}</p>
                    <input type="text" className={classes.authField} required value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="mt-[var(--spacing-y)] w-2/3">
                    <p className="font-semibold">{t('auth.password')}</p>
                    <input type="password" className={classes.authField} required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mt-[var(--spacing-y)] w-2/3">
                    <p className="font-semibold">{t('auth.reEnterPassword')}</p>
                    <input type="password" className={classes.authField} required value={rePassword} onChange={(e) => setRePassword(e.target.value)}/>
                </div>
                <div className="mt-[var(--spacing-y)] w-2/3">
                    <p className="font-semibold">{t('auth.adafruitUsername')}</p>
                    <input type="text" className={classes.authField} required value={mqttUsername} onChange={(e) => setMqttUsername(e.target.value)}/>
                </div>
                <div className="mt-[var(--spacing-y)] w-2/3">
                    <p className="font-semibold">{t('auth.aioKey')}</p>
                    <input type="password" className={classes.authField} required value={aioKey} onChange={(e) => setAioKey(e.target.value)}/>
                </div>
                <div className="mt-[var(--spacing-section)] w-2/3">
                    <button type="button" className={classes.authSubmitButton} onClick={handleRegister}>{t('auth.signup')}</button>
                </div>
                <div className="mt-[var(--spacing-x)] w-full text-center">
                    <p className="inline-block">{t('auth.haveAccount')}&nbsp;</p>
                    <button type="button" className={classes.textLinkButton} onClick={() => navigate('/login')}>{t('auth.loginHere')}</button>
                </div>
            </div>
        </div>
    );      
}
