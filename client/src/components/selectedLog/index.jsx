import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { DUMMY_LOGS } from '../../data/dummyData';
import { getTranslatedApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';
import { classes } from '../../styles/classes';
import { getLogsByDate } from '../../services/apiService';

/**
 * Format log timestamp for display.
 *
 * @param {string} dateString - API date text.
 * @returns {string} Local date-time text.
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    // Định dạng theo dạng 'ngày/tháng/năm giờ:phút:giây'
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * Render calendar-driven log history.
 *
 * @returns {JSX.Element} Selected-date log history.
 */
export default function SeHistory() {
    const sessionID = localStorage.getItem('sessionID');
    const [logData, setlogData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const hasLoadedInitialDate = useRef(false);
    const navigate = useNavigate();
    const { t } = useI18n();

    /**
     * Convert API logs to display rows.
     *
     * @param {Array<object>} logs - API log list.
     * @returns {Array<{activity: string, time: string}>} Display rows.
     */
    const toLogRows = (logs) => logs.map(log => ({
        activity: log.activity,
        time: formatTime(log.Date),
    }));

    useEffect(() => {
        /**
         * Fetch logs for selected calendar date.
         *
         * @returns {Promise<void>}
         */
        const fetchData = async () => {
            try {
				if (!localStorage.getItem('sessionID')){
					navigate('/login');
				}
                else{
                    const newDate = new Date(selectedDate);
                    if (hasLoadedInitialDate.current){
                        newDate.setDate(newDate.getDate() + 1);
                    }
                    else {
                        hasLoadedInitialDate.current = true;
                    }
                    const response = await getLogsByDate(sessionID, newDate.toISOString());
                    setlogData(toLogRows(response.data));
                }
            } catch (error) {
                if (isUnauthorized(error)) {
                    alert(getTranslatedApiErrorMessage(t, error));
                    navigate('/login');
                }
                else {
                    setlogData(toLogRows(DUMMY_LOGS));
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [navigate, sessionID, t, selectedDate]);
    return (
        <div className="flex flex-col md:flex-row md:items-start justify-center gap-[var(--spacing-section)] pt-[var(--spacing-section)] px-[var(--spacing-body)]">
            <div className={`w-full max-w-[360px] ${classes.panel} p-[var(--spacing-y)]`}>
                <Calendar onChange={setSelectedDate} value={selectedDate} className="app-calendar" />
            </div>
            <div className={`w-full md:flex-1 md:max-w-[760px] h-[450px] ${classes.panel} p-[var(--spacing-section)] overflow-auto`}>
                <p className="font-bold text-textGray 2xl:text-xl">{t('log.title')}</p>
                <hr className="h-px my-[var(--spacing-x)] bg-gray-200 border-0" />
                <div>
                    {logData.length === 0 ? (
                        <p className="py-[var(--spacing-x)] text-textGray xl:text-base 2xl:text-lg">{t('log.noDateData')}</p>
                    ) : (
                        logData.map((item)=>(
                            <p key={`${item.time}-${item.activity}`} className="py-[var(--spacing-x)] text-textGray xl:text-base 2xl:text-lg"> {item.time}: {item.activity} </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
