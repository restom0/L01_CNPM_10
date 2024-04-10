import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function PumpState() {
    const [pumpState, setPumpState] = useState(false);
    const [loading, setLoading] = useState(true);
    // const sessionID = document.cookie.split('; ').find((cookie) => cookie.startsWith(`sessionID=`)).split('=')[1]
    const sessionID = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTI3ODgzMTksImRhdGEiOiI2NjEzOTA2NDNhMzE5ZmViZGMxNzQxNDIiLCJpYXQiOjE3MTI3NTk1MTl9.p8mgMIWO4b3RHh8zewZU9KOZ_EXnw2MzKVCI1wBJ5cs";
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
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchApiData();

        const intervalId = setInterval(fetchApiData, 5 * 1000);

        return () => clearInterval(intervalId);
    }, []);
    const handleSwitchChange = async () => {
        try {
            const apiEndpoint = pumpState ? "http://localhost:3001/waterpumps/manual/off" : "http://localhost:3001/waterpumps/manual/on";
            setPumpState(!pumpState); // Toggle pumpState after API call is successful
            await axios.post(apiEndpoint, {}, { headers: { Authorization: "Bearer " + sessionID } });
        } catch (error) {
            console.error("Error toggling pump state:", error);
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
