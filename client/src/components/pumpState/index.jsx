import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DUMMY_PUMP_STATE } from '../../data/dummyData';
import { getTranslatedApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';
import { getWaterPumpState, turnWaterPumpOff, turnWaterPumpOn } from '../../services/apiService';

/**
 * Render pump state switch and manual on/off control.
 *
 * @param {{api_token: string}} props - Auth token props.
 * @returns {JSX.Element} Pump state control.
 */
export default function PumpState(props) {
    const [pumpState, setPumpState] = useState(false);
    const [loading, setLoading] = useState(true);
    const sessionID = props.api_token;
    const navigate = useNavigate();
    const { t } = useI18n();
    useEffect(() => {
        /**
         * Fetch latest pump state.
         *
         * @returns {Promise<void>}
         */
        const fetchApiData = async () => {
            try {
                const pumpResponse = await getWaterPumpState(sessionID);
                setPumpState(pumpResponse.data.data.value !== "OFF")
                setLoading(false);
            } catch (error) {
                if (isUnauthorized(error)) {
                    alert(getTranslatedApiErrorMessage(t, error));
                    navigate('/login');
                }
                else {
                    setPumpState(DUMMY_PUMP_STATE !== "OFF");
                    setLoading(false);
                    console.error("Error fetching data:", error);
                }
            }
        };
    
        fetchApiData();

        const intervalId = setInterval(fetchApiData, 10 * 1000);

        return () => clearInterval(intervalId);
    }, [navigate, sessionID, t]);
    /**
     * Toggle pump state and send matching manual pump command.
     *
     * @returns {Promise<void>}
     */
    const handleSwitchChange = async () => {
        try {
            setPumpState(!pumpState); // Toggle pumpState after API call is successful
            if (pumpState) {
                await turnWaterPumpOff(sessionID);
            } else {
                await turnWaterPumpOn(sessionID);
            }
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
            {loading ? (
            <div className='ml-[var(--spacing-x)] mt-[var(--spacing-y)]'>{t('common.loading')}</div>
            ) : (
                <div className='ml-[var(--spacing-x)] mt-[var(--spacing-y)]'>
                    <div name='title'>
                        {t('pump.status')}
                    </div>
                    <div>

                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={pumpState} onChange={handleSwitchChange}  />}
                                label={(pumpState) ? t('pump.running') : t('pump.stopped')}
                            />
                        </FormGroup>
                    </div>
                </div>
            )}
        </div>
	);      
}
