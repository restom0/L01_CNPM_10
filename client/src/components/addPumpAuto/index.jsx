import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdSettings } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';
import { getTranslatedApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';
import { classes } from '../../styles/classes';
import { createWaterPumpTimer } from '../../services/apiService';

/**
 * Render modal control for adding automatic watering timer.
 *
 * @param {{api_token: string}} props - Auth token props.
 * @returns {JSX.Element} Add timer control.
 */
export default function AddPumpAuto(props) {
    const [showModal, setShowModal] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showSettingsIcon, setShowSettingsIcon] = useState(true);
    const sessionID = props.api_token;

    const navigate = useNavigate();
    const { t } = useI18n();


    /**
     * Store selected start time.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event.
     * @returns {void}
     */
    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    /**
     * Store selected end time.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event.
     * @returns {void}
     */
    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    /**
     * Toggle add timer modal.
     *
     * @returns {void}
     */
    const handleIconClick = () => {
        setShowModal(!showModal);
        setShowSettingsIcon(!showSettingsIcon);
    };

    /**
     * Submit new timer range to API.
     *
     * @returns {Promise<void>}
     */
    const handleSubmit = async () => {
        try {
            await createWaterPumpTimer(sessionID, startTime, endTime);
            alert(t('pump.addAutoSuccess'));
        } catch (error) {
            if (isUnauthorized(error)) {
                alert(getTranslatedApiErrorMessage(t, error));
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
                            <button className={classes.scheduleButton} onClick={handleSubmit}>{t('common.ok')}</button>
                        </div>
                        <div className='clear-both'></div>
                    </div>
                </div>
            )}
        </div>
    );      
}
