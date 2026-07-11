import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DUMMY_PUMP_STATE } from '../../data/dummyData';
import { getApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';

export default function PumpState(props) {
    const [pumpState, setPumpState] = useState(false);
    const [loading, setLoading] = useState(true);
    const sessionID = props.api_token;
    const navigate = useNavigate();
    const { t } = useI18n();
    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    }
                };
                const pumpResponse = await axios.get(`http://localhost:3001/waterpumps`, config);
                setPumpState((pumpResponse.data.data.value == "OFF") ? false : true)
                setLoading(false);
            } catch (error) {
                if (isUnauthorized(error)) {
                    alert('Error: ' + getApiErrorMessage(error));
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
    }, [navigate, sessionID]);
    const handleSwitchChange = async () => {
        try {
            const apiEndpoint = pumpState ? "http://localhost:3001/waterpumps/manual/off" : "http://localhost:3001/waterpumps/manual/on";
            setPumpState(!pumpState); // Toggle pumpState after API call is successful
            await axios.post(apiEndpoint, {}, { headers: { Authorization: "Bearer " + sessionID } });
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
