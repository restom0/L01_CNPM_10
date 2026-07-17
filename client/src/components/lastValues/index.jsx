import React, { useState, useEffect } from "react";
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
import {
  calculateEnvironmentDryness,
  getLatestHumidity,
  getLatestLight,
  getLatestMoisture,
  getLatestTemperature,
  updateHumidityThreshold,
  updateLightThreshold,
  updateMoistureThreshold,
  updateTemperatureThreshold,
} from "../../services/apiService";

/**
 * Format an API timestamp for sensor cards.
 *
 * @param {string} inputTime - API timestamp.
 * @returns {string} Local date-time text.
 */
function formatTime(inputTime) {
  const date = new Date(inputTime);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

/**
 * Normalize latest sensor API response into card state.
 *
 * @param {object} response - API response payload.
 * @returns {object} Sensor info for display.
 */
function toSensorInfo(response) {
  return {
    value: Number.parseFloat(response.data.value),
    time: formatTime(response.data.created_at),
    lowerThreshold: response.lower,
    upperThreshold: response.upper,
    needNoti: response.needNoti,
  };
}

/**
 * Normalize latest light response and scale lux to gauge percentages.
 *
 * @param {object} response - API response payload.
 * @returns {object} Light info for display.
 */
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
/**
 * Return raw gauge arc values for sensors already expressed as 0-100.
 *
 * @param {object} info - Sensor info.
 * @returns {{value: number, lower: number, upper: number}} Gauge arc values.
 */
const rawArc = (info) => ({
  value: info.value,
  lower: info.lowerThreshold,
  upper: info.upperThreshold,
});

/**
 * Return percent-scaled gauge arc values for light readings.
 *
 * @param {object} info - Light sensor info.
 * @returns {{value: number, lower: number, upper: number}} Gauge arc values.
 */
const lightArc = (info) => ({
  value: info.valuePercent,
  lower: info.lowerThresholdPercent,
  upper: info.upperThresholdPercent,
});

/**
 * Render latest sensor cards and threshold controls.
 *
 * @param {{api_token: string}} props - Auth token props.
 * @returns {JSX.Element} Latest values section.
 */
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

  /**
   * Set one sensor loading state by sensor key.
   *
   * @param {string} sensor - Sensor key.
   * @param {boolean} value - Loading state.
   * @returns {void}
   */
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
    /**
     * Fetch latest sensor values and update card state.
     *
     * @returns {Promise<void>}
     */
    const fetchApiData = async () => {
      try {
        const tempResponse = await getLatestTemperature(sessionID);
        const lightResponse = await getLatestLight(sessionID);
        const humidResponse = await getLatestHumidity(sessionID);
        const moistureResponse = await getLatestMoisture(sessionID);
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

    /**
     * Ask API to calculate and store environmental dryness.
     *
     * @returns {Promise<void>}
     */
    const fetchEDApiData = async () => {
      try {
        await calculateEnvironmentDryness(sessionID);
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

  /**
   * Submit threshold update when Enter is pressed in a threshold input.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event.
   * @param {string} sensor - Sensor key.
   * @returns {void}
   */
  function handleKeyDown(e, sensor) {
    if (e.key === "Enter") {
      e.preventDefault();
      const updateThreshold = async () => {
        try {
          let lower;
          let upper;
          let updateThresholdRequest;

          if (sensor === "temp") {
            setTempLoading(true);
            lower = tempInfo.lowerThreshold;
            upper = tempInfo.upperThreshold;
            updateThresholdRequest = updateTemperatureThreshold;
          } else if (sensor === "light") {
            setLightLoading(true);
            lower = lightInfo.lowerThreshold;
            upper = lightInfo.upperThreshold;
            updateThresholdRequest = updateLightThreshold;
          } else if (sensor === "humid") {
            setHumidLoading(true);
            lower = humidInfo.lowerThreshold;
            upper = humidInfo.upperThreshold;
            updateThresholdRequest = updateHumidityThreshold;
          } else {
            setMoistureLoading(true);
            lower = moistureInfo.lowerThreshold;
            upper = moistureInfo.upperThreshold;
            updateThresholdRequest = updateMoistureThreshold;
          }

          await updateThresholdRequest(sessionID, upper, lower);
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

  /**
   * Create a threshold input change handler for one sensor field.
   *
   * @param {Function} setInfo - State setter.
   * @param {object} info - Current sensor info.
   * @param {string} field - Field to update.
   * @returns {Function} Change handler.
   */
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
