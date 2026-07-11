import React, { useCallback, useEffect, useState } from 'react';
import {CircularProgress} from '@mui/material';
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DUMMY_CHART_SERIES } from '../../data/dummyData';
import { getApiErrorMessage, isUnauthorized } from '../../utils/apiError';
import { useI18n } from '../../i18n';

function toDate(str) {
    return new Date(str);
}

export default function Charts(props) {
    const navigate = useNavigate();
    const sessionID = props.api_token;
    const { t, language } = useI18n();
    const makeChartData = useCallback((series, unit) => [
        [{ type: "date", label: t("chart.time") }, unit],
        ...series.map(({data, Date}) => [toDate(Date), parseFloat(data)]),
    ], [t]);
    const [tempLoading, setTempLoading] = useState(true);
    const [lightLoading, setLightLoading] = useState(true);
    const [humidLoading, setHumidLoading] = useState(true);
    const [moistureLoading, setMoistureLoading] = useState(true);
    const [EDLoading, setEDLoading] = useState(true);
    const [processedTemp, setProcessedTemp] = useState(() => makeChartData([], "°C"));
    const [processedLight, setProcessedLight] = useState(() => makeChartData([], "lux"));
    const [processedHumid, setProcessedHumid] = useState(() => makeChartData([], "%"));
    const [processedMoisture, setProcessedMoisture] = useState(() => makeChartData([], "%"));
    const [processedED, setProcessedED] = useState(() => makeChartData([], ""));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    }
                };
                const tempResponse = await axios.get(`http://localhost:3001/sensors/chart/temp`, config);
                setProcessedTemp(makeChartData(tempResponse.data.data, "°C"));
                setTempLoading(false);

                const lightResponse = await axios.get(`http://localhost:3001/sensors/chart/light`, config);
                setProcessedLight(makeChartData(lightResponse.data.data, "lux"));
                setLightLoading(false);

                const humidResponse = await axios.get(`http://localhost:3001/sensors/chart/humid`, config);
                setProcessedHumid(makeChartData(humidResponse.data.data, "%"));
                setHumidLoading(false);

                const moistureResponse = await axios.get(`http://localhost:3001/sensors/chart/moisture`, config);
                setProcessedMoisture(makeChartData(moistureResponse.data.data, "%"));
                setMoistureLoading(false);
                
                const EDResponse = await axios.get(`http://localhost:3001/sensors/chart/ed`, config);
                setProcessedED(makeChartData(EDResponse.data.data, ""));
                setEDLoading(false);
            } catch (error) {
                if (isUnauthorized(error)) {
                    alert('Error: ' + getApiErrorMessage(error));
                    navigate('/login');
                }
                else {
                    setProcessedTemp(makeChartData(DUMMY_CHART_SERIES.temp, "°C"));
                    setProcessedLight(makeChartData(DUMMY_CHART_SERIES.light, "lux"));
                    setProcessedHumid(makeChartData(DUMMY_CHART_SERIES.humid, "%"));
                    setProcessedMoisture(makeChartData(DUMMY_CHART_SERIES.moisture, "%"));
                    setProcessedED(makeChartData(DUMMY_CHART_SERIES.ed, ""));
                    setTempLoading(false);
                    setLightLoading(false);
                    setHumidLoading(false);
                    setMoistureLoading(false);
                    setEDLoading(false);
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 10 * 1000);

        return () => clearInterval(intervalId);
    }, [language, makeChartData, navigate, sessionID]);

    return (
        <div>
            <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)]'>
                <div name='title-subtitle' className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    <div name='title' className='font-bold'>
                        {t('sensor.environmentDryness')}
                    </div>
                </div>
                {EDLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)] text-center leading-[400px]'>
                        <CircularProgress
                            variant='indeterminate' value={50}
                            size={50}
                            thickness={3}
                        />
                    </div>
                    ) : (
                        <div>
                        <Chart
                            height={"400px"}
                            width={"100%"}
                            chartType="LineChart"
                            data={processedED}
                            options={{
                                pointSize: 2,
                                lineWidth: 1,
                                series: {
                                    0: { pointShape: 'circle' },
                                }
                            }}
                            />
                    </div>
                )}
            </div>
            <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)]'>
                <div name='title-subtitle' className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    <div name='title' className='font-bold'>
                        {t('sensor.temperature')}
                    </div>
                </div>
                {tempLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)] text-center leading-[400px]'>
                        <CircularProgress
                            variant='indeterminate' value={50}
                            size={50}
                            thickness={3}
                        />
                    </div>
                    ) : (
                    <div>
                        <Chart
                            height={"400px"}
                            width={"100%"}
                            chartType="LineChart"
                            data={processedTemp}
                            options={{
                                pointSize: 2,
                                lineWidth: 1,
                                series: {
                                    0: { pointShape: 'circle' },
                                }
                            }}
                            />
                    </div>
                )}
            </div>
            <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)]'>
                <div name='title-subtitle' className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    <div name='title' className='font-bold'>
                        {t('sensor.light')}
                    </div>
                </div>
                {lightLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)] text-center leading-[400px]'>
                        <CircularProgress
                            variant='indeterminate' value={50}
                            size={50}
                            thickness={3}
                        />
                    </div>
                    ) : (
                    <div>
                        <Chart
                            height={"400px"}
                            width={"100%"}
                            chartType="LineChart"
                            data={processedLight}
                            options={{
                                pointSize: 2,
                                lineWidth: 1,
                                series: {
                                    0: { pointShape: 'circle' },
                                }
                            }}
                            />
                    </div>
                )}
            </div>
            <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)]'>
                <div name='title-subtitle' className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    <div name='title' className='font-bold'>
                        {t('sensor.airHumidity')}
                    </div>
                </div>
                {humidLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)] text-center leading-[400px]'>
                        <CircularProgress
                            variant='indeterminate' value={50}
                            size={50}
                            thickness={3}
                        />
                    </div>
                    ) : (
                    <div>
                        <Chart
                            height={"400px"}
                            width={"100%"}
                            chartType="LineChart"
                            data={processedHumid}
                            options={{
                                pointSize: 2,
                                lineWidth: 1,
                                series: {
                                    0: { pointShape: 'circle' },
                                }
                            }}
                            />
                    </div>
                )}
            </div>
            <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)]'>
                <div name='title-subtitle' className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    <div name='title' className='font-bold'>
                        {t('sensor.soilMoisture')}
                    </div>
                </div>
                {moistureLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-[var(--spacing-section)] text-center leading-[400px]'>
                        <CircularProgress
                            variant='indeterminate' value={50}
                            size={50}
                            thickness={3}
                        />
                    </div>
                    ) : (
                    <div>
                        <Chart
                            height={"400px"}
                            width={"100%"}
                            chartType="LineChart"
                            data={processedMoisture}
                            options={{
                                pointSize: 2,
                                lineWidth: 1,
                                series: {
                                    0: { pointShape: 'circle' },
                                }
                            }}
                            />
                    </div>
                )}
            </div>
        </div>
    );
}
