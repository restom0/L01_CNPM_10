/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "language";

const LANGUAGES = [
  { code: "vi", countryCode: "VN", flag: "🇻🇳" },
  { code: "en", countryCode: "US", flag: "🇺🇸" },
];

const translations = {
  vi: {
    "app.title": "IOT Dashboard",
    "language.label": "Ngôn ngữ",
    "nav.dashboard": "Bảng điều khiển",
    "nav.chart": "Biểu đồ",
    "nav.setting": "Quản lý chung",
    "nav.log": "Nhật ký",
    "nav.logout": "Đăng xuất",
    "nav.user": "Tài khoản",
    "auth.loginIntro": "Nhập username và password để đăng nhập",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.login": "Đăng nhập",
    "auth.noAccount": "Chưa có tài khoản,",
    "auth.signupHere": "Đăng ký tại đây",
    "auth.signup": "Đăng ký",
    "auth.reEnterPassword": "Nhập lại password",
    "auth.adafruitUsername": "Adafruit username",
    "auth.aioKey": "AioKey",
    "auth.haveAccount": "Đã có tài khoản,",
    "auth.loginHere": "Đăng nhập tại đây",
    "error.usernameRequired": "Username không được để trống!",
    "error.passwordRequired": "Password không được để trống!",
    "error.mqttUsernameRequired": "mqttUsername không được để trống!",
    "error.aioKeyRequired": "aioKey không được để trống!",
    "error.passwordMismatch": "Mật khẩu không khớp!",
    "error.badRequest": "400: Bad request",
    "error.invalidLogin": "Username hoặc Password không đúng!",
    "error.accountExists": "Tài khoản đã tồn tại!",
    "common.loading": "Đang tải...",
    "common.cancel": "Hủy",
    "common.ok": "OK",
    "common.from": "Từ",
    "common.to": "Đến",
    "common.startTime": "Thời gian bắt đầu:",
    "common.endTime": "Thời gian kết thúc:",
    "common.lowerThreshold": "Ngưỡng dưới",
    "common.upperThreshold": "Ngưỡng trên",
    "log.title": "Nhật ký",
    "log.noTodayData": "Chưa có dữ liệu trong hôm nay.",
    "log.noDateData": "Không có dữ liệu trong ngày này.",
    "pump.info": "Thông tin máy bơm",
    "pump.management": "Quản lý máy bơm",
    "pump.chooseMode": "Chọn chế độ",
    "pump.pump1": "Máy bơm 1",
    "pump.manual": "Thủ công",
    "pump.auto": "Tự động",
    "pump.addTime": "Thêm giờ",
    "pump.status": "Trạng thái hoạt động",
    "pump.running": "Máy bơm 1 đang hoạt động",
    "pump.stopped": "Máy bơm 1 đang tắt",
    "pump.addAutoSuccess": "Thêm giờ tự động tưới thành công",
    "pump.editAutoSuccess": "Sửa giờ tự động tưới thành công",
    "sensor.environmentDryness": "Độ khô của môi trường",
    "sensor.temperature": "Nhiệt độ (°C)",
    "sensor.light": "Ánh sáng (lux)",
    "sensor.airHumidity": "Độ ẩm không khí (%)",
    "sensor.soilMoisture": "Độ ẩm đất (%)",
    "sensor.sourceTemperature": "Lấy từ cảm biến nhiệt độ",
    "sensor.sourceLight": "Lấy từ cảm biến ánh sáng",
    "sensor.sourceAirHumidity": "Lấy từ cảm biến độ ẩm",
    "sensor.sourceSoilMoisture": "Lấy từ cảm biến độ ẩm đất",
    "sensor.temperatureOutOfRange": "Nhiệt độ ngoài ngưỡng",
    "sensor.temperatureNormal": "Nhiệt độ bình thường",
    "sensor.lightOutOfRange": "Ánh sáng ngoài ngưỡng",
    "sensor.lightNormal": "Ánh sáng bình thường",
    "sensor.humidityOutOfRange": "Độ ẩm ngoài ngưỡng",
    "sensor.humidityNormal": "Độ ẩm bình thường",
    "chart.time": "Thời gian",
    "user.account": "Tài khoản: abc",
    "user.password": "Mật khẩu: abc",
    "user.adafruitAccount": "Tài khoản Adafruit: abc",
    "register.success": "Đăng ký thành công!",
  },
  en: {
    "app.title": "IOT Dashboard",
    "language.label": "Language",
    "nav.dashboard": "Dashboard",
    "nav.chart": "Charts",
    "nav.setting": "Settings",
    "nav.log": "Logs",
    "nav.logout": "Logout",
    "nav.user": "Account",
    "auth.loginIntro": "Enter username and password to sign in",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.login": "Sign in",
    "auth.noAccount": "No account yet,",
    "auth.signupHere": "sign up here",
    "auth.signup": "Sign up",
    "auth.reEnterPassword": "Re-enter password",
    "auth.adafruitUsername": "Adafruit username",
    "auth.aioKey": "AioKey",
    "auth.haveAccount": "Already have an account,",
    "auth.loginHere": "sign in here",
    "error.usernameRequired": "Username is required!",
    "error.passwordRequired": "Password is required!",
    "error.mqttUsernameRequired": "mqttUsername is required!",
    "error.aioKeyRequired": "aioKey is required!",
    "error.passwordMismatch": "Passwords do not match!",
    "error.badRequest": "400: Bad request",
    "error.invalidLogin": "Username or password is incorrect!",
    "error.accountExists": "Account already exists!",
    "common.loading": "Loading...",
    "common.cancel": "Cancel",
    "common.ok": "OK",
    "common.from": "From",
    "common.to": "To",
    "common.startTime": "Start time:",
    "common.endTime": "End time:",
    "common.lowerThreshold": "Lower threshold",
    "common.upperThreshold": "Upper threshold",
    "log.title": "Logs",
    "log.noTodayData": "No data for today.",
    "log.noDateData": "No data for this day.",
    "pump.info": "Pump information",
    "pump.management": "Pump management",
    "pump.chooseMode": "Select mode",
    "pump.pump1": "Pump 1",
    "pump.manual": "Manual",
    "pump.auto": "Auto",
    "pump.addTime": "Add time",
    "pump.status": "Operating status",
    "pump.running": "Pump 1 is running",
    "pump.stopped": "Pump 1 is off",
    "pump.addAutoSuccess": "Automatic watering time added successfully",
    "pump.editAutoSuccess": "Automatic watering time updated successfully",
    "sensor.environmentDryness": "Environmental dryness",
    "sensor.temperature": "Temperature (°C)",
    "sensor.light": "Light (lux)",
    "sensor.airHumidity": "Air humidity (%)",
    "sensor.soilMoisture": "Soil moisture (%)",
    "sensor.sourceTemperature": "From temperature sensor",
    "sensor.sourceLight": "From light sensor",
    "sensor.sourceAirHumidity": "From humidity sensor",
    "sensor.sourceSoilMoisture": "From soil moisture sensor",
    "sensor.temperatureOutOfRange": "Temperature out of range",
    "sensor.temperatureNormal": "Temperature normal",
    "sensor.lightOutOfRange": "Light out of range",
    "sensor.lightNormal": "Light normal",
    "sensor.humidityOutOfRange": "Humidity out of range",
    "sensor.humidityNormal": "Humidity normal",
    "chart.time": "Time",
    "user.account": "Account: abc",
    "user.password": "Password: abc",
    "user.adafruitAccount": "Adafruit account: abc",
    "register.success": "Registration successful!",
  },
};

function getStoredLanguage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return "vi";
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY) || "vi";
  } catch {
    return "vi";
  }
}

const defaultLanguage = getStoredLanguage();

const I18nContext = createContext({
  language: defaultLanguage,
  languages: LANGUAGES,
  setLanguage: () => {},
  t: (key) => translations[defaultLanguage]?.[key] || key,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(defaultLanguage);

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  };

  const value = useMemo(
    () => ({
      language,
      languages: LANGUAGES,
      setLanguage,
      t: (key) => translations[language]?.[key] || translations.vi[key] || key,
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
