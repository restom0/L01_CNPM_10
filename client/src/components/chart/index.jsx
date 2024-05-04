import React, { useState, useEffect } from 'react';
import {CircularProgress} from '@mui/material';
import { Chart } from 'react-google-charts';
import axios from 'axios';

function toDate(str) {
    return new Date(str);
}

export default function Charts(props) {
    const [sessionID, setSessionID] = useState(props.api_token);
    const [tempLoading, setTempLoading] = useState(true);
    const [lightLoading, setLightLoading] = useState(true);
    const [humidLoading, setHumidLoading] = useState(true);
    const [moistureLoading, setMoistureLoading] = useState(true);
    const [processedTemp, setProcessedTemp] = useState([[{ type: "date", label: "time" }, "°C"]]);
    const [processedLight, setProcessedLight] = useState([[{ type: "date", label: "time" }, "lux"]]);
    const [processedHumid, setProcessedHumid] = useState([[{ type: "date", label: "time" }, "%"]]);
    const [processedMoisture, setProcessedMoisture] = useState([[{ type: "date", label: "time" }, "%"]]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    }
                };
                const tempResponse = await axios.get(`http://localhost:3001/sensors/chart/temp`, config);
                setProcessedTemp(processedTemp.concat(
                    tempResponse.data.data.map(({_id, userID, data, Date}) => {
                        return [toDate(Date), parseFloat(data)];
                    })
                ));
                setTempLoading(false);

                const lightResponse = await axios.get(`http://localhost:3001/sensors/chart/light`, config);
                setProcessedLight(processedLight.concat(
                    lightResponse.data.data.map(({_id, userID, data, Date}) => {
                        return [toDate(Date), parseFloat(data)];
                    })
                ));
                setLightLoading(false);

                const humidResponse = await axios.get(`http://localhost:3001/sensors/chart/humid`, config);
                setProcessedHumid(processedHumid.concat(
                    humidResponse.data.data.map(({_id, userID, data, Date}) => {
                        return [toDate(Date), parseFloat(data)];
                    })
                ));
                setHumidLoading(false);

                const moistureResponse = await axios.get(`http://localhost:3001/sensors/chart/moisture`, config);
                setProcessedMoisture(processedMoisture.concat(
                    moistureResponse.data.data.map(({_id, userID, data, Date}) => {
                        return [toDate(Date), parseFloat(data)];
                    })
                ));
                setMoistureLoading(false);
            } catch (error) {
                if (error.response.status == 403 || error.response.status == 401) {
                    alert('Error: ' + error.response.data.message);
                    navigate('/login');
                }
                else {
                    alert('Error: ' + error.response.data.error);
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 10 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div className='h-[500px] rounded-lg bg-white mb-4'>
                <div name='title-subtitle' className='pl-1 pt-2'>
                    <div name='title' className='font-bold'>
                        Nhiệt độ (°C)
                    </div>
                </div>
                {tempLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-4 text-center leading-[400px]'>
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
            <div className='h-[500px] rounded-lg bg-white mb-4'>
                <div name='title-subtitle' className='pl-1 pt-2'>
                    <div name='title' className='font-bold'>
                        Ánh sáng (lux)
                    </div>
                </div>
                {lightLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-4 text-center leading-[400px]'>
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
            <div className='h-[500px] rounded-lg bg-white mb-4'>
                <div name='title-subtitle' className='pl-1 pt-2'>
                    <div name='title' className='font-bold'>
                        Độ ẩm không khí (%)
                    </div>
                </div>
                {humidLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-4 text-center leading-[400px]'>
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
            <div className='h-[500px] rounded-lg bg-white mb-4'>
                <div name='title-subtitle' className='pl-1 pt-2'>
                    <div name='title' className='font-bold'>
                        Độ ẩm đất (%)
                    </div>
                </div>
                {moistureLoading ? (
                    <div className='h-[500px] rounded-lg bg-white mb-4 text-center leading-[400px]'>
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
