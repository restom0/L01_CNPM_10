import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function PumpState(props) {
    const [pumpState, setPumpState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessionID, setSessionID] = useState(props.api_token);
    const navigate = useNavigate();
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
                if (error.response.status == 403 || error.response.status == 401) {
                    alert('Error: ' + error.response.data.message);
                    navigate('/login');
                }
                else {
                    alert('Error: ' + error.response.data.error);
                    console.error("Error fetching data:", error);
                }
            }
        };
    
        fetchApiData();

        const intervalId = setInterval(fetchApiData, 10 * 1000);

        return () => clearInterval(intervalId);
    }, []);
    const handleSwitchChange = async () => {
        try {
            const apiEndpoint = pumpState ? "http://localhost:3001/waterpumps/manual/off" : "http://localhost:3001/waterpumps/manual/on";
            setPumpState(!pumpState); // Toggle pumpState after API call is successful
            await axios.post(apiEndpoint, {}, { headers: { Authorization: "Bearer " + sessionID } });
        } catch (error) {
            if (error.response.status == 403 || error.response.status == 401) {
                alert('Error: ' + error.response.data.message);
                navigate('/login');
            }
            else {
                alert('Error: ' + error.response.data.error);
                console.error("Error fetching data:", error);
            }
        }
    };
	return (
        <div>
            {loading ? (
            <div className='ml-1 mt-2'>Loading...</div>
            ) : (
                <div className='ml-1 mt-2'>
                    <div name='title'>
                        Trạng thái hoạt động
                    </div>
                    <div>
                        
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={pumpState} onChange={handleSwitchChange}  />}
                                label={(pumpState) ? "Máy bơm 1 đang hoạt động" : "Máy bơm 1 đang tắt"}
                            />
                        </FormGroup>
                    </div>
                </div>
            )}
        </div>
	);      
}
