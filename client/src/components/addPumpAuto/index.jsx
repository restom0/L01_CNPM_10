import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdSettings } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';

export default function AddPumpAuto(props) {
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

    const handleSubmit = async () => {
        try {
            const config = {
                headers: {
                    Authorization: "Bearer " + sessionID,
                }
            };
            await axios.post(`http://localhost:3001/waterpumps/auto`, {'startTime':startTime, 'endTime':endTime}, config);
            alert('Thêm giờ tự động tưới thành công');
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
            <div className='pr-1 pt-2 float-right'>
                Thêm giờ
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
                        <div className='mx-2 mt-2'>
                            <label className='w-[200px]'>Start Time:</label><br/>
                            <input className='rounded-full' type="time" value={startTime} onChange={handleStartTimeChange} />
                        </div>
                        <div className='ml-2 mt-2'>
                            <label>End Time:</label><br/>
                            <input className='rounded-full' type="time" value={endTime} onChange={handleEndTimeChange} />
                        </div>
                        <div className='float-right'>
                            <button className="bg-mainBlue text-center rounded-full w-[60px] text-white m-2" onClick={handleSubmit}>OK</button>
                        </div>
                        <div className='clear-both'></div>
                    </div>
                </div>
            )}
        </div>
    );      
}
