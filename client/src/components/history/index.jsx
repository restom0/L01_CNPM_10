import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function formatTime(dateString) {
    const date = new Date(dateString);
    // Định dạng theo dạng 'ngày/tháng/năm giờ:phút:giây'
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export default function History(props) {
    const [sessionID, setSessionID] = useState(props.api_token);
    const oldLogData =[
        {
            activity: "Nhập dữ liệuOFF vào WaterPumps",
            time: "2024-04-05 15:53:11"
        },
        {
            activity: "Nhập dữ liệu34.5 vào TemperatureSensors",
            time: "2024-04-05 15:54:53"
        },
        {
            activity: "Nhập dữ liệu3702 vào LightSensors",
            time: "2024-04-05 15:54:53"
        },
        {
            activity: "Nhập dữ liệu0.0 vào MoistureSensors",
            time: "2024-04-05 15:54:53"
        },
        {
            activity: "Nhập dữ liệu61.2 vào HumiditySensors",
            time: "2024-04-05 15:54:53"
        }
    ];
    const data=oldLogData.slice(oldLogData.length-5,oldLogData.length);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    }
                };
                const date = new Date();
                const response = await axios.get('http://localhost:3001/logs', config);
                const fetchedLogs = response.data.map(log => ({
                    activity: log.activity,
                    time: formatTime(log.date),
                }));
                setlogData(fetchedLogs);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="md:w-[280px] xl:w-[400px] 2xl:w-[400px] h-[400px] bg-white p-4" onClick={() => navigate("/dashboard")}>
            <p className="font-bold">Nhật ký</p>
            <hr className="h-px my-2 bg-black border-0"></hr>
            <div>
                {data.map((item,index)=>(
                    <p key={index} className="py-1"> {item.time}: {item.activity} </p>))}
            </div>
        </div>
    );
}