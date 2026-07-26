import axios from "axios";
import {
  DUMMY_ADMIN,
  DUMMY_CHART_SERIES,
  DUMMY_LOGS,
  DUMMY_PUMP_AUTOS,
  DUMMY_PUMP_RESPONSE,
  DUMMY_SENSOR_RESPONSES,
} from "../data/dummyData";

const API_BASE_URL = "http://localhost:3001";
const DEMO_MESSAGES = {
  thresholdUpdated: { message: "Threshold updated" },
  pumpOn: { data: "Pump is turned on" },
  pumpOff: { data: "Pump is turned off" },
  timerCreated: { data: "Timer is created" },
  timerUpdated: { data: "Timer is updated" },
  timerDeleted: { data: "Timer is deleted" },
};

function isDemoSession(sessionID) {
  return sessionID === DUMMY_ADMIN.token;
}

function demoResponse(data) {
  return Promise.resolve({ data });
}

function withDemo(sessionID, data, request) {
  if (isDemoSession(sessionID)) {
    return demoResponse(data);
  }
  return request();
}

/**
 * Build bearer auth config for protected API requests.
 *
 * @param {string} sessionID - Local auth marker or JWT token.
 * @param {object} [extraConfig] - Extra axios config.
 * @returns {object} Axios request config with auth header.
 */
function authConfig(sessionID, extraConfig = {}) {
  return {
    ...extraConfig,
    headers: {
      ...extraConfig.headers,
      Authorization: "Bearer " + sessionID,
    },
  };
}

/**
 * Build threshold query params while preserving backend validation behavior.
 *
 * @param {number|string} upper - Upper threshold value.
 * @param {number|string} lower - Lower threshold value.
 * @returns {{upper?: number|string, lower?: number|string}} Query params.
 */
function thresholdParams(upper, lower) {
  const params = {};
  if (upper !== "") {
    params.upper = upper;
  }
  if (lower !== "") {
    params.lower = lower;
  }
  return params;
}

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login user.
 *     tags: [Users]
 */
/**
 * Login with username and password.
 *
 * @param {string} username - Account username.
 * @param {string} password - Account password.
 * @returns {Promise<import("axios").AxiosResponse>} Login response.
 */
export function loginUser(username, password) {
  return axios.post(`${API_BASE_URL}/login`, { username, password });
}

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register user.
 *     tags: [Users]
 */
/**
 * Register a new user account.
 *
 * @param {string} username - Account username.
 * @param {string} password - Account password.
 * @param {string} mqttUsername - Adafruit IO username.
 * @param {string} aioKey - Adafruit IO key.
 * @returns {Promise<import("axios").AxiosResponse>} Register response.
 */
export function registerUser(username, password, mqttUsername, aioKey) {
  return axios.post(`${API_BASE_URL}/register`, {
    username,
    password,
    mqttUsername,
    aioKey,
  });
}

/**
 * @openapi
 * /logout:
 *   post:
 *     summary: Logout user.
 *     tags: [Users]
 */
/**
 * Logout and clear server auth cookie.
 *
 * @returns {Promise<import("axios").AxiosResponse>} Logout response.
 */
export function logoutUser() {
  return axios.post(`${API_BASE_URL}/logout`);
}

/**
 * @openapi
 * /sensors/temp:
 *   get:
 *     summary: Get latest temperature value.
 *     tags: [Sensors]
 */
/**
 * Get latest temperature reading with thresholds.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Temperature response.
 */
export function getLatestTemperature(sessionID) {
  return withDemo(sessionID, DUMMY_SENSOR_RESPONSES.temp, () =>
    axios.get(`${API_BASE_URL}/sensors/temp`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/light:
 *   get:
 *     summary: Get latest light value.
 *     tags: [Sensors]
 */
/**
 * Get latest light reading with thresholds.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Light response.
 */
export function getLatestLight(sessionID) {
  return withDemo(sessionID, DUMMY_SENSOR_RESPONSES.light, () =>
    axios.get(`${API_BASE_URL}/sensors/light`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/humid:
 *   get:
 *     summary: Get latest humidity value.
 *     tags: [Sensors]
 */
/**
 * Get latest humidity reading with thresholds.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Humidity response.
 */
export function getLatestHumidity(sessionID) {
  return withDemo(sessionID, DUMMY_SENSOR_RESPONSES.humid, () =>
    axios.get(`${API_BASE_URL}/sensors/humid`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/moisture:
 *   get:
 *     summary: Get latest soil moisture value.
 *     tags: [Sensors]
 */
/**
 * Get latest soil moisture reading with thresholds.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Moisture response.
 */
export function getLatestMoisture(sessionID) {
  return withDemo(sessionID, DUMMY_SENSOR_RESPONSES.moisture, () =>
    axios.get(`${API_BASE_URL}/sensors/moisture`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/ed:
 *   get:
 *     summary: Calculate latest environmental dryness.
 *     tags: [Sensors]
 */
/**
 * Trigger latest environmental dryness calculation.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Environmental dryness response.
 */
export function calculateEnvironmentDryness(sessionID) {
  return withDemo(
    sessionID,
    { data: DUMMY_CHART_SERIES.ed[DUMMY_CHART_SERIES.ed.length - 1] },
    () => axios.get(`${API_BASE_URL}/sensors/ed`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/chart/temp:
 *   get:
 *     summary: Get temperature history.
 *     tags: [Sensors]
 */
/**
 * Get temperature chart history.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Temperature chart response.
 */
export function getTemperatureChart(sessionID) {
  return withDemo(sessionID, { data: DUMMY_CHART_SERIES.temp }, () =>
    axios.get(`${API_BASE_URL}/sensors/chart/temp`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/chart/light:
 *   get:
 *     summary: Get light history.
 *     tags: [Sensors]
 */
/**
 * Get light chart history.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Light chart response.
 */
export function getLightChart(sessionID) {
  return withDemo(sessionID, { data: DUMMY_CHART_SERIES.light }, () =>
    axios.get(`${API_BASE_URL}/sensors/chart/light`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/chart/humid:
 *   get:
 *     summary: Get humidity history.
 *     tags: [Sensors]
 */
/**
 * Get humidity chart history.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Humidity chart response.
 */
export function getHumidityChart(sessionID) {
  return withDemo(sessionID, { data: DUMMY_CHART_SERIES.humid }, () =>
    axios.get(`${API_BASE_URL}/sensors/chart/humid`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/chart/moisture:
 *   get:
 *     summary: Get soil moisture history.
 *     tags: [Sensors]
 */
/**
 * Get soil moisture chart history.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Moisture chart response.
 */
export function getMoistureChart(sessionID) {
  return withDemo(sessionID, { data: DUMMY_CHART_SERIES.moisture }, () =>
    axios.get(`${API_BASE_URL}/sensors/chart/moisture`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/chart/ed:
 *   get:
 *     summary: Get environmental dryness history.
 *     tags: [Sensors]
 */
/**
 * Get environmental dryness chart history.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Environmental dryness chart response.
 */
export function getEnvironmentDrynessChart(sessionID) {
  return withDemo(sessionID, { data: DUMMY_CHART_SERIES.ed }, () =>
    axios.get(`${API_BASE_URL}/sensors/chart/ed`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /sensors/threshold/temp:
 *   put:
 *     summary: Update temperature thresholds.
 *     tags: [Sensors]
 */
/**
 * Update temperature threshold bounds.
 *
 * @param {string} sessionID - Auth token.
 * @param {number|string} upper - Upper threshold.
 * @param {number|string} lower - Lower threshold.
 * @returns {Promise<import("axios").AxiosResponse>} Update response.
 */
export function updateTemperatureThreshold(sessionID, upper, lower) {
  return withDemo(sessionID, DEMO_MESSAGES.thresholdUpdated, () =>
    axios.put(`${API_BASE_URL}/sensors/threshold/temp`, {}, authConfig(sessionID, {
      params: thresholdParams(upper, lower),
    }))
  );
}

/**
 * @openapi
 * /sensors/threshold/light:
 *   put:
 *     summary: Update light thresholds.
 *     tags: [Sensors]
 */
/**
 * Update light threshold bounds.
 *
 * @param {string} sessionID - Auth token.
 * @param {number|string} upper - Upper threshold.
 * @param {number|string} lower - Lower threshold.
 * @returns {Promise<import("axios").AxiosResponse>} Update response.
 */
export function updateLightThreshold(sessionID, upper, lower) {
  return withDemo(sessionID, DEMO_MESSAGES.thresholdUpdated, () =>
    axios.put(`${API_BASE_URL}/sensors/threshold/light`, {}, authConfig(sessionID, {
      params: thresholdParams(upper, lower),
    }))
  );
}

/**
 * @openapi
 * /sensors/threshold/humid:
 *   put:
 *     summary: Update humidity thresholds.
 *     tags: [Sensors]
 */
/**
 * Update humidity threshold bounds.
 *
 * @param {string} sessionID - Auth token.
 * @param {number|string} upper - Upper threshold.
 * @param {number|string} lower - Lower threshold.
 * @returns {Promise<import("axios").AxiosResponse>} Update response.
 */
export function updateHumidityThreshold(sessionID, upper, lower) {
  return withDemo(sessionID, DEMO_MESSAGES.thresholdUpdated, () =>
    axios.put(`${API_BASE_URL}/sensors/threshold/humid`, {}, authConfig(sessionID, {
      params: thresholdParams(upper, lower),
    }))
  );
}

/**
 * @openapi
 * /sensors/threshold/moisture:
 *   put:
 *     summary: Update soil moisture thresholds.
 *     tags: [Sensors]
 */
/**
 * Update soil moisture threshold bounds.
 *
 * @param {string} sessionID - Auth token.
 * @param {number|string} upper - Upper threshold.
 * @param {number|string} lower - Lower threshold.
 * @returns {Promise<import("axios").AxiosResponse>} Update response.
 */
export function updateMoistureThreshold(sessionID, upper, lower) {
  return withDemo(sessionID, DEMO_MESSAGES.thresholdUpdated, () =>
    axios.put(`${API_BASE_URL}/sensors/threshold/moisture`, {}, authConfig(sessionID, {
      params: thresholdParams(upper, lower),
    }))
  );
}

/**
 * @openapi
 * /logs:
 *   get:
 *     summary: Get logs by date.
 *     tags: [Logs]
 */
/**
 * Get logs for one date.
 *
 * @param {string} sessionID - Auth token.
 * @param {Date|string} date - Selected date.
 * @returns {Promise<import("axios").AxiosResponse>} Logs response.
 */
export function getLogsByDate(sessionID, date) {
  return withDemo(sessionID, DUMMY_LOGS, () =>
    axios.get(`${API_BASE_URL}/logs`, authConfig(sessionID, {
      params: { date },
    }))
  );
}

/**
 * @openapi
 * /waterpumps:
 *   get:
 *     summary: Get latest water pump state.
 *     tags: [Water Pumps]
 */
/**
 * Get latest water pump state.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Pump state response.
 */
export function getWaterPumpState(sessionID) {
  return withDemo(sessionID, { data: DUMMY_PUMP_RESPONSE }, () =>
    axios.get(`${API_BASE_URL}/waterpumps`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /waterpumps/manual/on:
 *   post:
 *     summary: Turn water pump on.
 *     tags: [Water Pumps]
 */
/**
 * Turn water pump on.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Pump command response.
 */
export function turnWaterPumpOn(sessionID) {
  return withDemo(sessionID, DEMO_MESSAGES.pumpOn, () =>
    axios.post(`${API_BASE_URL}/waterpumps/manual/on`, {}, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /waterpumps/manual/off:
 *   post:
 *     summary: Turn water pump off.
 *     tags: [Water Pumps]
 */
/**
 * Turn water pump off.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Pump command response.
 */
export function turnWaterPumpOff(sessionID) {
  return withDemo(sessionID, DEMO_MESSAGES.pumpOff, () =>
    axios.post(`${API_BASE_URL}/waterpumps/manual/off`, {}, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /waterpumps/auto:
 *   get:
 *     summary: List automatic watering timers.
 *     tags: [Water Pumps]
 */
/**
 * List automatic watering timers.
 *
 * @param {string} sessionID - Auth token.
 * @returns {Promise<import("axios").AxiosResponse>} Timer list response.
 */
export function listWaterPumpTimers(sessionID) {
  return withDemo(sessionID, { data: DUMMY_PUMP_AUTOS }, () =>
    axios.get(`${API_BASE_URL}/waterpumps/auto`, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /waterpumps/auto:
 *   post:
 *     summary: Create automatic watering timer.
 *     tags: [Water Pumps]
 */
/**
 * Create automatic watering timer.
 *
 * @param {string} sessionID - Auth token.
 * @param {string} startTime - Start time in HH:mm format.
 * @param {string} endTime - End time in HH:mm format.
 * @returns {Promise<import("axios").AxiosResponse>} Create response.
 */
export function createWaterPumpTimer(sessionID, startTime, endTime) {
  return withDemo(sessionID, DEMO_MESSAGES.timerCreated, () =>
    axios.post(`${API_BASE_URL}/waterpumps/auto`, { startTime, endTime }, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /waterpumps/auto/{id}:
 *   put:
 *     summary: Update automatic watering timer.
 *     tags: [Water Pumps]
 */
/**
 * Update automatic watering timer.
 *
 * @param {string} sessionID - Auth token.
 * @param {string} id - Timer id.
 * @param {string} startTime - Start time in HH:mm format.
 * @param {string} endTime - End time in HH:mm format.
 * @returns {Promise<import("axios").AxiosResponse>} Update response.
 */
export function updateWaterPumpTimer(sessionID, id, startTime, endTime) {
  return withDemo(sessionID, DEMO_MESSAGES.timerUpdated, () =>
    axios.put(`${API_BASE_URL}/waterpumps/auto/${id}`, { startTime, endTime }, authConfig(sessionID))
  );
}

/**
 * @openapi
 * /waterpumps/auto/{id}:
 *   delete:
 *     summary: Delete automatic watering timer.
 *     tags: [Water Pumps]
 */
/**
 * Delete automatic watering timer.
 *
 * @param {string} sessionID - Auth token.
 * @param {string} id - Timer id.
 * @returns {Promise<import("axios").AxiosResponse>} Delete response.
 */
export function deleteWaterPumpTimer(sessionID, id) {
  return withDemo(sessionID, DEMO_MESSAGES.timerDeleted, () =>
    axios.delete(`${API_BASE_URL}/waterpumps/auto/${id}`, authConfig(sessionID))
  );
}
