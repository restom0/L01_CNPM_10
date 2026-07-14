import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DUMMY_LOGS } from "../../data/dummyData";
import { getTranslatedApiErrorMessage, isUnauthorized } from "../../utils/apiError";
import { useI18n } from "../../i18n";
import { classes } from "../../styles/classes";

function formatTime(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export default function History(props) {
  const sessionID = props.api_token;
  const [logData, setlogData] = useState([]);
  const navigate = useNavigate();
  const { t } = useI18n();

  const toLogRows = (logs) =>
    logs.map((log) => ({
      activity: log.activity,
      time: formatTime(log.Date),
    }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const config = {
          headers: {
            Authorization: "Bearer " + sessionID,
          },
          params: {
            date: today,
          },
        };
        const response = await axios.get("http://localhost:3001/logs", config);
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
