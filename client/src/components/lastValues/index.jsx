import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SensorCard from "../sensorCard";
import TemperatureCelsiusGood from "../../assets/images/temperature-celsius-good.svg";
import TemperatureCelsiusWarning from "../../assets/images/temperature-celsius-warning.svg";
import LightIntensityGood from "../../assets/images/light-intensity-good.svg";
import LightIntensityWarning from "../../assets/images/light-intensity-warning.svg";
import SoilMoistureWarning from "../../assets/images/soil-moisture-warning.svg";
import SoilMoistureGood from "../../assets/images/soil-moisture-good.svg";
import AirHumidityWarning from "../../assets/images/air-humidity-warning.svg";
import AirHumidityGood from "../../assets/images/air-humidity-good.svg";
import { DUMMY_SENSOR_RESPONSES } from "../../data/dummyData";
import { getTranslatedApiErrorMessage, isUnauthorized } from "../../utils/apiError";
import { useI18n } from "../../i18n";

function formatTime(inputTime) {
  const date = new Date(inputTime);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

function toSensorInfo(response) {
  return {
    value: Number.parseFloat(response.data.value),
    time: formatTime(response.data.created_at),
    lowerThreshold: response.lower,
    upperThreshold: response.upper,
    needNoti: response.needNoti,
  };
}

function toLightInfo(response) {
  return {
    ...toSensorInfo(response),
    valuePercent: (response.data.value * 100) / 10000,
    lowerThresholdPercent: (response.lower * 100) / 10000,
    upperThresholdPercent: (response.upper * 100) / 10000,
  };
}

// Gauge arc inputs: most sensors plot the raw value/thresholds (already 0–100);
// light is scaled to a percentage of its 0–10000 lux range.
const rawArc = (info) => ({
  value: info.value,
  lower: info.lowerThreshold,
  upper: info.upperThreshold,
});
const lightArc = (info) => ({
  value: info.valuePercent,
  lower: info.lowerThresholdPercent,
  upper: info.upperThresholdPercent,
});

export default function LastValues(props) {
  const [tempInfo, setTempInfo] = useState(null);
  const [lightInfo, setLightInfo] = useState(null);
  const [humidInfo, setHumidInfo] = useState(null);
  const [moistureInfo, setMoistureInfo] = useState(null);
  const [tempLoading, setTempLoading] = useState(true);
  const [lightLoading, setLightLoading] = useState(true);
  const [humidLoading, setHumidLoading] = useState(true);
  const [moistureLoading, setMoistureLoading] = useState(true);
  const navigate = useNavigate();
  const sessionID = props.api_token;
  const { t } = useI18n();

  const setSensorLoading = (sensor, value) => {
    if (sensor === "temp") {
      setTempLoading(value);
    } else if (sensor === "light") {
      setLightLoading(value);
    } else if (sensor === "humid") {
      setHumidLoading(value);
    } else {
      setMoistureLoading(value);
    }
  };

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const config = {
          headers: {
            Authorization: "Bearer " + sessionID,
          },
        };
        const tempResponse = await axios.get(
          `http://localhost:3001/sensors/temp`,
          config
        );
        const lightResponse = await axios.get(
          `http://localhost:3001/sensors/light`,
          config
        );
        const humidResponse = await axios.get(
          `http://localhost:3001/sensors/humid`,
          config
        );
        const moistureResponse = await axios.get(
          `http://localhost:3001/sensors/moisture`,
          config
        );
        setTempInfo(toSensorInfo(tempResponse.data));
        setTempLoading(false);
        setLightInfo(toLightInfo(lightResponse.data));
        setLightLoading(false);
        setHumidInfo(toSensorInfo(humidResponse.data));
        setHumidLoading(false);
        setMoistureInfo(toSensorInfo(moistureResponse.data));
        setMoistureLoading(false);
      } catch (error) {
        if (isUnauthorized(error)) {
          alert(getTranslatedApiErrorMessage(t, error));
          navigate("/login");
        } else {
          setTempInfo(toSensorInfo(DUMMY_SENSOR_RESPONSES.temp));
          setLightInfo(toLightInfo(DUMMY_SENSOR_RESPONSES.light));
          setHumidInfo(toSensorInfo(DUMMY_SENSOR_RESPONSES.humid));
          setMoistureInfo(toSensorInfo(DUMMY_SENSOR_RESPONSES.moisture));
          setTempLoading(false);
          setLightLoading(false);
          setHumidLoading(false);
          setMoistureLoading(false);
          console.error("Error fetching data:", error);
        }
      }
    };

    const fetchEDApiData = async () => {
      try {
        const config = {
          headers: {
            Authorization: "Bearer " + sessionID,
          },
        };
        await axios.get(`http://localhost:3001/sensors/ed`, config);
      } catch (error) {
        if (isUnauthorized(error)) {
          alert(getTranslatedApiErrorMessage(t, error));
          navigate("/login");
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchApiData();
    fetchEDApiData();
    const otherIntervalId = setInterval(fetchApiData, 10 * 1000);
    const EDintervalId = setInterval(fetchEDApiData, 10 * 1000);

    return () => {
      clearInterval(otherIntervalId);
      clearInterval(EDintervalId);
    };
  }, [navigate, sessionID, t]);

  function handleKeyDown(e, sensor) {
    if (e.key === "Enter") {
      e.preventDefault();
      const updateThreshold = async () => {
        try {
          const config = {
            headers: {
              Authorization: "Bearer " + sessionID,
            },
          };
          let lower;
          let upper;
          let apiUrl;

          if (sensor === "temp") {
            setTempLoading(true);
            lower = tempInfo.lowerThreshold;
            upper = tempInfo.upperThreshold;
          } else if (sensor === "light") {
            setLightLoading(true);
            lower = lightInfo.lowerThreshold;
            upper = lightInfo.upperThreshold;
          } else if (sensor === "humid") {
            setHumidLoading(true);
            lower = humidInfo.lowerThreshold;
            upper = humidInfo.upperThreshold;
          } else {
            setMoistureLoading(true);
            lower = moistureInfo.lowerThreshold;
            upper = moistureInfo.upperThreshold;
          }

          if (lower === "" && upper === "") {
            apiUrl = `http://localhost:3001/sensors/threshold/` + sensor + "?";
          } else if (lower === "") {
            apiUrl =
              `http://localhost:3001/sensors/threshold/` +
              sensor +
              "?upper=" +
              upper;
          } else if (upper === "") {
            apiUrl =
              `http://localhost:3001/sensors/threshold/` +
              sensor +
              "?lower=" +
              lower;
          } else {
            apiUrl =
              `http://localhost:3001/sensors/threshold/` +
              sensor +
              "?upper=" +
              upper +
              "&lower=" +
              lower;
          }

          await axios.put(apiUrl, {}, config);
          setSensorLoading(sensor, false);
        } catch (error) {
          if (isUnauthorized(error)) {
            alert(getTranslatedApiErrorMessage(t, error));
            navigate("/login");
          } else {
            setSensorLoading(sensor, false);
            console.error("Error fetching data:", error);
          }
        }
      };

      updateThreshold();
    }
  }

  const onThresholdChange = (setInfo, info, field) => (e) =>
    setInfo({
      ...info,
      [field]: e.target.value !== "" ? Number.parseFloat(e.target.value) : "",
    });

  const sensors = [
    {
      key: "temp",
      title: t("sensor.temperature"),
      subtitle: t("sensor.sourceTemperature"),
      info: tempInfo,
      loading: tempLoading,
      setInfo: setTempInfo,
      unit: "°C",
      iconGood: TemperatureCelsiusGood,
      iconWarn: TemperatureCelsiusWarning,
      normalKey: "sensor.temperatureNormal",
      warnKey: "sensor.temperatureOutOfRange",
      arc: rawArc,
    },
    {
      key: "light",
      title: t("sensor.light"),
      subtitle: t("sensor.sourceLight"),
      info: lightInfo,
      loading: lightLoading,
      setInfo: setLightInfo,
      unit: "lux",
      iconGood: LightIntensityGood,
      iconWarn: LightIntensityWarning,
      normalKey: "sensor.lightNormal",
      warnKey: "sensor.lightOutOfRange",
      arc: lightArc,
    },
    {
      key: "humid",
      title: t("sensor.airHumidity"),
      subtitle: t("sensor.sourceAirHumidity"),
      info: humidInfo,
      loading: humidLoading,
      setInfo: setHumidInfo,
      unit: "%",
      iconGood: AirHumidityGood,
      iconWarn: AirHumidityWarning,
      normalKey: "sensor.humidityNormal",
      warnKey: "sensor.humidityOutOfRange",
      arc: rawArc,
    },
    {
      key: "moisture",
      title: t("sensor.soilMoisture"),
      subtitle: t("sensor.sourceSoilMoisture"),
      info: moistureInfo,
      loading: moistureLoading,
      setInfo: setMoistureInfo,
      unit: "%",
      iconGood: SoilMoistureGood,
      iconWarn: SoilMoistureWarning,
      normalKey: "sensor.humidityNormal",
      warnKey: "sensor.humidityOutOfRange",
      arc: rawArc,
    },
  ];

  return (
    <div>
      <div className="md:w-[650px] xl:w-[700px] 2xl:w-[900px]">
        <div className="grid grid-cols-2 gap-x-[var(--spacing-x)] gap-y-[var(--spacing-y)] w-full">
          {sensors.map((s) => (
            <SensorCard
              key={s.key}
              title={s.title}
              subtitle={s.subtitle}
              loading={s.loading}
              info={s.info}
              arc={s.arc}
              unit={s.unit}
              iconGood={s.iconGood}
              iconWarn={s.iconWarn}
              normalKey={s.normalKey}
              warnKey={s.warnKey}
              onLowerChange={onThresholdChange(s.setInfo, s.info, "lowerThreshold")}
              onUpperChange={onThresholdChange(s.setInfo, s.info, "upperThreshold")}
              onKeyDown={(e) => handleKeyDown(e, s.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
