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
        <div className="flex flex-col md:flex-row md:items-start justify-center gap-[var(--spacing-section)] pt-[var(--spacing-section)] px-[var(--spacing-body)]">
            <div className="w-full max-w-[360px] bg-white rounded-xl shadow-sm p-[var(--spacing-y)]">
                <Calendar onChange={GetDate} value={value} className="app-calendar" />
            </div>
            <div className="w-full md:flex-1 md:max-w-[760px] h-[450px] bg-white rounded-xl shadow-sm p-[var(--spacing-section)] overflow-auto">
                <p className="font-bold text-textGray 2xl:text-xl">{t('log.title')}</p>
                <hr className="h-px my-[var(--spacing-x)] bg-gray-200 border-0" />
                <div>
                    {logData.length === 0 ? (
                        <p className="py-[var(--spacing-x)] text-textGray xl:text-base 2xl:text-lg">{t('log.noDateData')}</p>
                    ) : (
                        logData.map((item,index)=>(
                            <p key={index} className="py-[var(--spacing-x)] text-textGray xl:text-base 2xl:text-lg"> {item.time}: {item.activity} </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
