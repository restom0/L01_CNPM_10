import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DUMMY_LOGS } from "../../data/dummyData";
import { getTranslatedApiErrorMessage, isUnauthorized } from "../../utils/apiError";
import { useI18n } from "../../i18n";
import { classes } from "../../styles/classes";
import { getLogsByDate } from "../../services/apiService";

/**
 * Format log timestamp for display.
 *
 * @param {string} dateString - API date text.
 * @returns {string} Local date-time text.
 */
function formatTime(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * Render today's log preview card.
 *
 * @param {{api_token: string}} props - Auth token props.
 * @returns {JSX.Element} Log preview.
 */
export default function History(props) {
  const sessionID = props.api_token;
  const [logData, setlogData] = useState([]);
  const navigate = useNavigate();
  const { t } = useI18n();

  /**
   * Convert API logs to display rows.
   *
   * @param {Array<object>} logs - API log list.
   * @returns {Array<{activity: string, time: string}>} Display rows.
   */
  const toLogRows = (logs) =>
    logs.map((log) => ({
      activity: log.activity,
      time: formatTime(log.Date),
    }));

  useEffect(() => {
    /**
     * Fetch today's logs.
     *
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      try {
        const today = new Date();
        const response = await getLogsByDate(sessionID, today);
        setlogData(toLogRows(response.data));
      } catch (error) {
        if (isUnauthorized(error)) {
          alert(getTranslatedApiErrorMessage(t, error));
          navigate("/login");
        } else {
          setlogData(toLogRows(DUMMY_LOGS));
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [navigate, sessionID, t]);
  return (
    <button
      type="button"
      className={`md:w-[280px] xl:w-[400px] 2xl:w-[400px] h-[400px] ${classes.panel} p-[var(--spacing-y)] overflow-auto cursor-pointer text-left`}
      onClick={() => navigate("/log")}
    >
      <p className="font-bold">{t('log.title')}</p>
      <hr className="h-px my-[var(--spacing-x)] bg-black border-0"></hr>
      <div>
        {logData.length === 0 ? (
          <p className="py-[var(--spacing-x)]">{t('log.noTodayData')}</p>
        ) : (
          logData.map((item) => (
            <p key={`${item.time}-${item.activity}`} className="py-[var(--spacing-x)]">
              {" "}
              {item.time}: {item.activity}{" "}
            </p>
          ))
        )}
      </div>
    </button>
  );
}
