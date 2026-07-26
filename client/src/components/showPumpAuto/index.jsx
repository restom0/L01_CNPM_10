import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import { MdCancel, MdEdit } from 'react-icons/md';
import { DUMMY_PUMP_AUTOS } from '../../data/dummyData';
import { getTranslatedApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';
import { classes } from '../../styles/classes';
import {
    deleteWaterPumpTimer,
    listWaterPumpTimers,
    updateWaterPumpTimer,
} from '../../services/apiService';

/**
 * Render automatic watering timer list and edit controls.
 *
 * @param {{api_token: string}} props - Auth token props.
 * @returns {JSX.Element} Timer list.
 */
export default function ShowPumpAuto(props) {
    const [pumpAutos, setPumpAutos] = useState([]);
    const [loading, setLoading] = useState(true);
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
     * Toggle edit timer modal.
     *
     * @returns {void}
     */
    const handleIconClick = () => {
        setShowModal(!showModal);
        setShowSettingsIcon(!showSettingsIcon);
    };

    /**
     * Submit timer update to API.
     *
     * @param {string} id - Timer id.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (id) => {
        try {
            await updateWaterPumpTimer(sessionID, id, startTime, endTime);
            alert(t('pump.editAutoSuccess'));
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


    /**
     * Delete timer from API and local list.
     *
     * @param {string} id - Timer id.
     * @returns {Promise<void>}
     */
    const deletePumpAuto = async (id) => {
        setLoading(true);
        try {
            await deleteWaterPumpTimer(sessionID, id);
            setPumpAutos((current) => current.filter((pumpAuto) => pumpAuto.id !== id));
            setLoading(false);
        } catch (error) {
            if (isUnauthorized(error)) {
                alert(getTranslatedApiErrorMessage(t, error));
                navigate('/login');
            }
            else {
                setPumpAutos((current) => current.filter((pumpAuto) => pumpAuto.id !== id));
                setLoading(false);
                console.error("Error fetching data:", error);
            }
        }
    }

    useEffect(() => {
        /**
         * Fetch automatic watering timers.
         *
         * @returns {Promise<void>}
         */
        const fetchApiData = async () => {
            try {
                const pumpAutosResponse = await listWaterPumpTimers(sessionID);
                setPumpAutos(pumpAutosResponse.data.data);
                setLoading(false);
            } catch (error) {
                if (isUnauthorized(error)) {
                    alert(getTranslatedApiErrorMessage(t, error));
                    navigate('/login');
                }
                else {
                    setPumpAutos(DUMMY_PUMP_AUTOS);
                    setLoading(false);
                    console.error("Error fetching data:", error);
                }
            }
        };
    
        fetchApiData();

        const intervalId = setInterval(fetchApiData, 10 * 1000);

        return () => clearInterval(intervalId);
    }, [navigate, sessionID, t]);

    return (
        <div>
            {loading ? (
                <div className='md:w-[280px] xl:w-[400px] 2xl:w-[400px] text-center leading-[200px]'>
                    <CircularProgress
                        variant='indeterminate' value={50}
                        size={50}
                        thickness={3}
                    />
                </div>
            ) : (
                <div>
                    {
                        pumpAutos.map((pumpAuto) => (
                            <div key={pumpAuto.id}>
                                <div className='h-[44px] rounded-full bg-lightGray pl-[var(--spacing-x)] mr-[var(--spacing-x)] mt-[var(--spacing-y)] leading-[44px]'>
                                    {showSettingsIcon ? (
                                        <MdEdit onClick={handleIconClick} className='inline mr-1' cursor={'pointer'} color='black' size={20}/>
                                    ) : (
                                        <MdCancel onClick={handleIconClick} className='inline mr-1' cursor={'pointer'} color='black' size={20}/>
                                    )}
                                    {t('common.from')} {pumpAuto.startTime} {t('common.to')} {pumpAuto.endTime}
                                    <button type="button" className="bg-mainRed text-center rounded-full min-h-[44px] w-[64px] text-white float-right" onClick={() => deletePumpAuto(pumpAuto.id)}>{t('common.cancel')}</button>
                                </div>
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
                                                <button type="button" className={classes.scheduleButton} onClick={() => handleSubmit(pumpAuto.id)}>{t('common.ok')}</button>
                                            </div>
                                            <div className='clear-both'></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );      
}
