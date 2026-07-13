const now = new Date();

function minutesAgo(minutes) {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
}

export const DUMMY_SENSOR_RESPONSES = {
  temp: {
    data: { value: 27, created_at: minutesAgo(5) },
    lower: 18,
    upper: 35,
    needNoti: false,
  },
  light: {
    data: { value: 5400, created_at: minutesAgo(7) },
    lower: 2000,
    upper: 8500,
    needNoti: false,
  },
  humid: {
    data: { value: 61, created_at: minutesAgo(9) },
    lower: 40,
    upper: 80,
    needNoti: false,
  },
  moisture: {
    data: { value: 48, created_at: minutesAgo(11) },
    lower: 30,
    upper: 70,
    needNoti: false,
  },
};

export const DUMMY_CHART_SERIES = {
  ed: [
    { Date: minutesAgo(60), data: 36 },
    { Date: minutesAgo(45), data: 42 },
    { Date: minutesAgo(30), data: 39 },
    { Date: minutesAgo(15), data: 44 },
  ],
  temp: [
    { Date: minutesAgo(60), data: 24 },
    { Date: minutesAgo(45), data: 26 },
    { Date: minutesAgo(30), data: 27 },
    { Date: minutesAgo(15), data: 28 },
  ],
  light: [
    { Date: minutesAgo(60), data: 4200 },
    { Date: minutesAgo(45), data: 5100 },
    { Date: minutesAgo(30), data: 5400 },
    { Date: minutesAgo(15), data: 6000 },
  ],
  humid: [
    { Date: minutesAgo(60), data: 58 },
    { Date: minutesAgo(45), data: 60 },
    { Date: minutesAgo(30), data: 61 },
    { Date: minutesAgo(15), data: 63 },
  ],
  moisture: [
    { Date: minutesAgo(60), data: 44 },
    { Date: minutesAgo(45), data: 46 },
    { Date: minutesAgo(30), data: 48 },
    { Date: minutesAgo(15), data: 49 },
  ],
};

export const DUMMY_LOGS = [
  { activity: "Demo: pump checked automatically", Date: minutesAgo(40) },
  { activity: "Demo: sensor values refreshed", Date: minutesAgo(25) },
  { activity: "Demo: watering schedule ready", Date: minutesAgo(10) },
];

export const DUMMY_PUMP_AUTOS = [
  { id: "demo-1", startTime: "05:00", endTime: "05:10" },
  { id: "demo-2", startTime: "16:00", endTime: "16:10" },
];

export const DUMMY_PUMP_STATE = "ON";

export const DUMMY_ADMIN = {
  username: "demo",
  token: "demo-admin-token",
};
