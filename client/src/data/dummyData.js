import {
  DEMO_ADMIN,
  DEMO_RAW_LOGS,
  DEMO_RAW_PUMP_EVENTS,
  DEMO_RAW_PUMP_TIMERS,
  DEMO_RAW_SENSOR_READINGS,
  DEMO_SENSOR_THRESHOLDS,
} from "./demoRawData";

function latest(series) {
  return series[series.length - 1];
}

function toSensorResponse(reading, thresholds) {
  return {
    data: { value: reading.value, created_at: reading.created_at },
    lower: thresholds.lower,
    upper: thresholds.upper,
    needNoti: reading.value < thresholds.lower || reading.value > thresholds.upper,
  };
}

function toChartRows(series) {
  return series.map((reading) => ({
    Date: reading.created_at,
    data: reading.value,
  }));
}

export const DUMMY_SENSOR_RESPONSES = {
  temp: toSensorResponse(latest(DEMO_RAW_SENSOR_READINGS.temperature), DEMO_SENSOR_THRESHOLDS.temperature),
  light: toSensorResponse(latest(DEMO_RAW_SENSOR_READINGS.light), DEMO_SENSOR_THRESHOLDS.light),
  humid: toSensorResponse(latest(DEMO_RAW_SENSOR_READINGS.humidity), DEMO_SENSOR_THRESHOLDS.humidity),
  moisture: toSensorResponse(latest(DEMO_RAW_SENSOR_READINGS.moisture), DEMO_SENSOR_THRESHOLDS.moisture),
};

export const DUMMY_CHART_SERIES = {
  ed: DEMO_RAW_SENSOR_READINGS.environmentDryness,
  temp: toChartRows(DEMO_RAW_SENSOR_READINGS.temperature),
  light: toChartRows(DEMO_RAW_SENSOR_READINGS.light),
  humid: toChartRows(DEMO_RAW_SENSOR_READINGS.humidity),
  moisture: toChartRows(DEMO_RAW_SENSOR_READINGS.moisture),
};

export const DUMMY_LOGS = DEMO_RAW_LOGS.map(({ activity, Date }) => ({ activity, Date }));

export const DUMMY_PUMP_AUTOS = DEMO_RAW_PUMP_TIMERS;

export const DUMMY_PUMP_RESPONSE = latest(DEMO_RAW_PUMP_EVENTS);

export const DUMMY_PUMP_STATE = DUMMY_PUMP_RESPONSE.value;

export { DEMO_ADMIN as DUMMY_ADMIN };
