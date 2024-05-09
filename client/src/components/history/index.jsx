import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function formatTime(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export default function History(props) {
    const [sessionID, setSessionID] = useState(props.api_token);
    const [logData, setlogData] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    },
                    params: {
                        date: today
                      }
                };
                const response = await axios.get('http://localhost:3001/logs', config);
                const fetchedLogs = response.data.map(log => ({
                    activity: log.activity,
                    time: formatTime(log.Date),
                }));
                setlogData(fetchedLogs);
            } catch (error) {
                if (error.response.status == 403 || error.response.status == 401) {
                    alert('Error: ' + error.response.data.message);
                    navigate('/login');
                }
                else {
                    alert('Error: ' + error.response.data.error);
                    console.error('Error fetching data:', error);
                }
                
            }
        };
        fetchData();
    }, []);
    return (
        <div className="md:w-[280px] xl:w-[400px] 2xl:w-[400px] h-[400px] bg-white p-4" onClick={() => navigate("/log")}>
            <p className="font-bold">Nhật ký</p>
            <hr className="h-px my-2 bg-black border-0"></hr>
            <div>
                {logData.length === 0 ? (
                    <p className="py-1">Chưa có dữ liệu trong hôm nay.</p>
                ) : (
                    logData.map((item,index)=>(
                        <p key={index} className="py-1"> {item.time}: {item.activity} </p>
                    ))
                )}
            </div>
        </div>
    );
}