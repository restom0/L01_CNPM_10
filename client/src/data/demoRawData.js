const now = new Date();

function minutesAgo(minutes) {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
}

export const DEMO_ADMIN = {
  username: "demo",
  password: "demo",
  token: "demo-admin-token",
};

export const DEMO_SENSOR_THRESHOLDS = {
  temperature: { lower: 18, upper: 35 },
  light: { lower: 2000, upper: 8500 },
  humidity: { lower: 40, upper: 80 },
  moisture: { lower: 30, upper: 70 },
};

export const DEMO_RAW_SENSOR_READINGS = {
  temperature: [
    { id: "temp-1", feed: "cambiennhietdo", value: 24, created_at: minutesAgo(60) },
    { id: "temp-2", feed: "cambiennhietdo", value: 26, created_at: minutesAgo(45) },
    { id: "temp-3", feed: "cambiennhietdo", value: 27, created_at: minutesAgo(30) },
    { id: "temp-4", feed: "cambiennhietdo", value: 28, created_at: minutesAgo(15) },
  ],
  light: [
    { id: "light-1", feed: "cambienanhsang", value: 4200, created_at: minutesAgo(60) },
    { id: "light-2", feed: "cambienanhsang", value: 5100, created_at: minutesAgo(45) },
    { id: "light-3", feed: "cambienanhsang", value: 5400, created_at: minutesAgo(30) },
    { id: "light-4", feed: "cambienanhsang", value: 6000, created_at: minutesAgo(15) },
  ],
  humidity: [
    { id: "humid-1", feed: "cambiendoam", value: 58, created_at: minutesAgo(60) },
    { id: "humid-2", feed: "cambiendoam", value: 60, created_at: minutesAgo(45) },
    { id: "humid-3", feed: "cambiendoam", value: 61, created_at: minutesAgo(30) },
    { id: "humid-4", feed: "cambiendoam", value: 63, created_at: minutesAgo(15) },
  ],
  moisture: [
    { id: "moisture-1", feed: "cambiendoamdat", value: 44, created_at: minutesAgo(60) },
    { id: "moisture-2", feed: "cambiendoamdat", value: 46, created_at: minutesAgo(45) },
    { id: "moisture-3", feed: "cambiendoamdat", value: 48, created_at: minutesAgo(30) },
    { id: "moisture-4", feed: "cambiendoamdat", value: 49, created_at: minutesAgo(15) },
  ],
  environmentDryness: [
    { id: "ed-1", data: 36, Date: minutesAgo(60) },
    { id: "ed-2", data: 42, Date: minutesAgo(45) },
    { id: "ed-3", data: 39, Date: minutesAgo(30) },
    { id: "ed-4", data: 44, Date: minutesAgo(15) },
  ],
};

export const DEMO_RAW_LOGS = [
  { id: "log-1", activity: "Demo: sensor values refreshed", Date: minutesAgo(55) },
  { id: "log-2", activity: "Demo: automatic watering window created", Date: minutesAgo(35) },
  { id: "log-3", activity: "Demo: pump checked automatically", Date: minutesAgo(20) },
  { id: "log-4", activity: "Demo: threshold update accepted", Date: minutesAgo(8) },
];

export const DEMO_RAW_PUMP_EVENTS = [
  { id: "pump-1", value: "OFF", created_at: minutesAgo(50) },
  { id: "pump-2", value: "ON", created_at: minutesAgo(12) },
];

export const DEMO_RAW_PUMP_TIMERS = [
  { id: "demo-1", startTime: "05:00", endTime: "05:10" },
  { id: "demo-2", startTime: "16:00", endTime: "16:10" },
];
