import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {CircularProgress, TextField} from '@mui/material';
import { MdCancel, MdEdit } from 'react-icons/md';

export default function ShowPumpAuto(props) {
    const [pumpAutos, setPumpAutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showSettingsIcon, setShowSettingsIcon] = useState(true);
    const [sessionID, setSessionID] = useState(props.api_token);
    const navigate = useNavigate();

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

    const handleSubmit = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: "Bearer " + sessionID,
                }
            };
            await axios.put(`http://localhost:3001/waterpumps/auto/` + id, {'startTime':startTime,'endTime':endTime}, config);
            alert('Sửa giờ tự động tưới thành công');
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


    const deletePumpAuto = async (id) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: "Bearer " + sessionID,
                }
            };
            await axios.delete(`http://localhost:3001/waterpumps/auto/` + id, config);
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
    }

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    }
                };
                const pumpAutosResponse = await axios.get(`http://localhost:3001/waterpumps/auto`, config);
                setPumpAutos(pumpAutosResponse.data.data);
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
                        pumpAutos.map((pumpAuto, index) => (
                            <div key={index} className=''>
                                <div className='h-[30px] rounded-full bg-lightGray pl-1 mr-1 mt-2 leading-[30px]'>
                                    {showSettingsIcon ? (
                                        <MdEdit onClick={handleIconClick} className='inline mr-1' cursor={'pointer'} color='black' size={20}/>
                                    ) : (
                                        <MdCancel onClick={handleIconClick} className='inline mr-1' cursor={'pointer'} color='black' size={20}/>
                                    )}
                                    From {pumpAuto.startTime} To {pumpAuto.endTime}
                                    <button className="bg-mainRed text-center rounded-full w-[50px] text-white float-right" onClick={() => deletePumpAuto(pumpAuto.id)}>Hủy</button>
                                </div>
                                {showModal && (
                                    <div className="modal">
                                        <div className="modal-content">
                                            <div className='mx-2 mt-2'>
                                                <label className='w-[200px]'>Start Time:</label><br/>
                                                <input className='rounded-full' type="time" value={startTime} onChange={handleStartTimeChange} />
                                            </div>
                                            <div className='ml-2 mt-2'>
                                                <label>End Time:</label><br/>
                                                <input className='rounded-full' type="time" value={endTime} onChange={handleEndTimeChange} />
                                            </div>
                                            <div className='float-right'>
                                                <button className="bg-mainBlue text-center rounded-full w-[60px] text-white m-2" onClick={() => handleSubmit(pumpAuto.id)}>OK</button>
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
