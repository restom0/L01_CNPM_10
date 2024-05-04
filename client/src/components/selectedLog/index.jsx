import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

function formatTime(dateString) {
    const date = new Date(dateString);
    // Định dạng theo dạng 'ngày/tháng/năm giờ:phút:giây'
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
const cookies = new Cookies();

export default function SeHistory(props) {
    const [sessionID, setSessionID] = useState();
    const [flag, setFlag] = useState(false);
    const [logData, setlogData] = useState([]);
    const [value, GetDate] = useState(new Date());
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
				if (!cookies.get('sessionID')){
					navigate('/login');
				}
                else{
                    setSessionID(cookies.get('sessionID'))
                    var newDate=new Date(value);
                    if (flag){
                        newDate.setDate(newDate.getDate() + 1);
                    }
                    else {
                        setFlag(true);
                    }
                    const config = {
                        headers: {
                          Authorization: "Bearer " + sessionID
                        },
                        params: {
                          date: newDate.toISOString()
                        }
                      };
                    const response = await axios.get('http://localhost:3001/logs', config);
                    const fetchedLogs = response.data.map(log => ({
                        activity: log.activity,
                        time: formatTime(log.Date),
                    }));
                    setlogData(fetchedLogs);
                }
            } catch (error) {
                if (error.response.status == 400) {
                    alert('400: Bad request');
                }
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [value]);
    return (
        <div className="flex justify-center pt-5">
            <div className="flex-grow w-30 pl-10 w-full max-w-[200px] md:max-w-[450px]">
                <Calendar onChange={GetDate} value={value} />
            </div>
            <div className="flex-grow md:w-[600px] xl:max-w-[750px] 2xl:w-[900px] h-[400px] bg-white p-4 overflow-auto" >
                <p className="font-bold 2xl:text-xl">Nhật ký</p>
                <hr className="h-px my-2 bg-black border-0"></hr>
                <div>
                    {logData.length === 0 ? (
                        <p className="py-1 xl:text-base 2xl:text-lg">Không có dữ liệu trong ngày này.</p>
                    ) : (
                        logData.map((item,index)=>(
                            <p key={index} className="py-1 xl:text-base 2xl:text-lg"> {item.time}: {item.activity} </p>
                        ))
                    )}
                </div>
            </div>
            <div className="flex-grow">
            </div>
        </div>


    );
}