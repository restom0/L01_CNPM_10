import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdSettings } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';
import { getApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';

export default function AddPumpAuto(props) {
    const [showModal, setShowModal] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showSettingsIcon, setShowSettingsIcon] = useState(true);
    const sessionID = props.api_token;

    const navigate = useNavigate();
    const { t } = useI18n();


    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleIconClick = () => {
        setShowModal(!showModal);
        setShowSettingsIcon(!showSettingsIcon);
    };

    const handleSubmit = async () => {
        try {
            const config = {
                headers: {
                    Authorization: "Bearer " + sessionID,
                }
            };
            await axios.post(`http://localhost:3001/waterpumps/auto`, {'startTime':startTime, 'endTime':endTime}, config);
            alert(t('pump.addAutoSuccess'));
        } catch (error) {
            if (isUnauthorized(error)) {
                alert('Error: ' + getApiErrorMessage(error));
                navigate('/login');
            }
            else {
                console.error("Error fetching data:", error);
            }
        }
    };

    return (
        <div>
            <div className='pr-[var(--spacing-x)] pt-[var(--spacing-y)] float-right'>
                {t('pump.addTime')}
                {showSettingsIcon ? (
                    <IoMdSettings onClick={handleIconClick} className='inline ml-1' cursor={'pointer'} color='black' size={20}/>
                ) : (
                    <MdCancel onClick={handleIconClick} className='inline ml-1' cursor={'pointer'} color='black' size={20}/>
                )}
            </div>
            <div className='clear-right'></div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className='mx-[var(--spacing-x)] mt-[var(--spacing-y)]'>
                            <label className='w-[200px]'>{t('common.startTime')}</label><br/>
                            <input className='rounded-full' type="time" value={startTime} onChange={handleStartTimeChange} />
                        </div>
                        <div className='ml-[var(--spacing-x)] mt-[var(--spacing-y)]'>
                            <label>{t('common.endTime')}</label><br/>
                            <input className='rounded-full' type="time" value={endTime} onChange={handleEndTimeChange} />
                        </div>
                        <div className='float-right'>
                            <button className="bg-mainBlue text-center rounded-full min-h-[44px] w-[60px] text-white m-[var(--spacing-x)]" onClick={handleSubmit}>{t('common.ok')}</button>
                        </div>
                        <div className='clear-both'></div>
                    </div>
                </div>
            )}
        </div>
    );      
}
