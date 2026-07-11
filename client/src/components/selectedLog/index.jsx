import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { DUMMY_LOGS } from '../../data/dummyData';
import { getApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';

function formatTime(dateString) {
    const date = new Date(dateString);
    // Định dạng theo dạng 'ngày/tháng/năm giờ:phút:giây'
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export default function SeHistory() {
    const sessionID = localStorage.getItem('sessionID');
    const [logData, setlogData] = useState([]);
    const [value, GetDate] = useState(new Date());
    const hasLoadedInitialDate = useRef(false);
    const navigate = useNavigate();
    const { t } = useI18n();

    const toLogRows = (logs) => logs.map(log => ({
        activity: log.activity,
        time: formatTime(log.Date),
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
				if (!localStorage.getItem('sessionID')){
					navigate('/login');
				}
                else{
                    var newDate=new Date(value);
                    if (hasLoadedInitialDate.current){
                        newDate.setDate(newDate.getDate() + 1);
                    }
                    else {
                        hasLoadedInitialDate.current = true;
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
                    setlogData(toLogRows(response.data));
                }
            } catch (error) {
                if (isUnauthorized(error)) {
                    alert('Error: ' + getApiErrorMessage(error));
                    navigate('/login');
                }
                else {
                    setlogData(toLogRows(DUMMY_LOGS));
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [navigate, sessionID, value]);
    return (
        <div className="flex justify-center pt-[var(--spacing-section)] gap-x-[var(--spacing-x)] gap-y-[var(--spacing-y)]">
            <div className="flex-grow w-30 pl-[var(--spacing-section)] w-full max-w-[200px] md:max-w-[450px]">
                <Calendar onChange={GetDate} value={value} />
            </div>
            <div className="flex-grow md:w-[600px] xl:max-w-[750px] 2xl:w-[900px] h-[400px] bg-white p-[var(--spacing-y)] overflow-auto" >
                <p className="font-bold 2xl:text-xl">{t('log.title')}</p>
                <hr className="h-px my-[var(--spacing-x)] bg-black border-0"></hr>
                <div>
                    {logData.length === 0 ? (
                        <p className="py-[var(--spacing-x)] xl:text-base 2xl:text-lg">{t('log.noDateData')}</p>
                    ) : (
                        logData.map((item,index)=>(
                            <p key={index} className="py-[var(--spacing-x)] xl:text-base 2xl:text-lg"> {item.time}: {item.activity} </p>
                        ))
                    )}
                </div>
            </div>
            <div className="flex-grow">
            </div>
        </div>


    );
}
