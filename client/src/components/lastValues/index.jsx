import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {CircularProgress, TextField} from '@mui/material';
import TemperatureCelsiusGood from '../../assets/images/temperature-celsius-good.svg';
import TemperatureCelsiusWarning from '../../assets/images/temperature-celsius-warning.svg';
import LightIntensityGood from '../../assets/images/light-intensity-good.svg';
import LightIntensityWarning from '../../assets/images/light-intensity-warning.svg';
import SoilMoistureWarning from '../../assets/images/soil-moisture-warning.svg';
import SoilMoistureGood from '../../assets/images/soil-moisture-good.svg';
import AirHumidityWarning from '../../assets/images/air-humidity-warning.svg';
import AirHumidityGood from '../../assets/images/air-humidity-good.svg';

function formatDateInfo(inputTime) {
    // const date = new Date(inputTime);
    // const today = new Date();
    // const yesterday = new Date(today);
    // yesterday.setDate(yesterday.getDate() - 1);

    // const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    // const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

    // if (isToday) {
    //     return `Hôm nay lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    // } else if (isYesterday) {
    //     return `Hôm qua lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    // } else {
    //     const day = date.getDate().toString().padStart(2, '0');
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //     const year = date.getFullYear();
    //     const hours = date.getHours().toString().padStart(2, '0');
    //     const minutes = date.getMinutes().toString().padStart(2, '0');
    //     return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
    // }
    return inputTime;
}

function formatTime(inputTime) {
    const date = new Date(inputTime);
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export default function LastValues(props) {
    const [tempInfo, setTempInfo] = useState(null);
    const [lightInfo, setLightInfo] = useState(null);
    const [humidInfo, setHumidInfo] = useState(null);
    const [moistureInfo, setMoistureInfo] = useState(null);
    const [tempLoading, setTempLoading] = useState(true);
    const [lightLoading, setLightLoading] = useState(true);
    const [humidLoading, setHumidLoading] = useState(true);
    const [moistureLoading, setMoistureLoading] = useState(true);
    const [EDLoading, setEDLoading] = useState(true);
    const navigate = useNavigate();
    const [sessionID, setSessionID] = useState(props.api_token);
    
    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    }
                };
                const tempResponse = await axios.get(`http://localhost:3001/sensors/temp`, config);
                const lightResponse = await axios.get(`http://localhost:3001/sensors/light`, config);
                const humidResponse = await axios.get(`http://localhost:3001/sensors/humid`, config);
                const moistureResponse = await axios.get(`http://localhost:3001/sensors/moisture`, config);
                setTempInfo(
                    {
                        value: parseFloat(tempResponse.data.data.value),
                        time: formatTime(tempResponse.data.data.created_at),
                        lowerThreshold: tempResponse.data.lower,
                        upperThreshold: tempResponse.data.upper,
                        needNoti: tempResponse.data.needNoti
                    }
                );
                setTempLoading(false);
                setLightInfo(
                    {
                        value: parseFloat(lightResponse.data.data.value),
                        valuePercent: lightResponse.data.data.value * 100 / 10000,
                        time: formatTime(lightResponse.data.data.created_at),
                        lowerThreshold: lightResponse.data.lower,
                        upperThreshold: lightResponse.data.upper,
                        lowerThresholdPercent: lightResponse.data.lower * 100 / 10000,
                        upperThresholdPercent: lightResponse.data.upper * 100 / 10000,
                        needNoti: lightResponse.data.needNoti
                    }
                );
                setLightLoading(false);
                setHumidInfo(
                    {
                        value: parseFloat(humidResponse.data.data.value),
                        time: formatTime(humidResponse.data.data.created_at),
                        lowerThreshold: humidResponse.data.lower,
                        upperThreshold: humidResponse.data.upper,
                        needNoti: humidResponse.data.needNoti
                    }
                );
                setHumidLoading(false);
                setMoistureInfo(
                    {
                        value: parseFloat(moistureResponse.data.data.value),
                        time: formatTime(moistureResponse.data.data.created_at),
                        lowerThreshold: moistureResponse.data.lower,
                        upperThreshold: moistureResponse.data.upper,
                        needNoti: moistureResponse.data.needNoti
                    }
                );
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

        const fetchEDApiData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: "Bearer " + sessionID,
                    }
                };
                const EDResponse = await axios.get(`http://localhost:3001/sensors/ed`, config);
                setEDLoading(false);
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
    
        fetchApiData();
        fetchEDApiData();
        // const otherIntervalId = setInterval(fetchApiData, 10 * 1000);
        // const EDintervalId = setInterval(fetchEDApiData, 30 * 1000);

        // return () => {
        //     clearInterval(otherIntervalId);
        //     clearInterval(EDintervalId);
        // }
    }, []);

    function handleKeyDown(e, sensor) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const updateThreshold = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: "Bearer " + sessionID,
                        }
                    };
                    var lower, upper, api_url;

                    if (sensor == 'temp') {
                        setTempLoading(true);
                        lower = tempInfo.lowerThreshold;
                        upper = tempInfo.upperThreshold;
                    }
                    else if (sensor == 'light') {
                        setLightLoading(true);
                        lower = lightInfo.lowerThreshold;
                        upper = lightInfo.upperThreshold;
                    }
                    else if (sensor == 'humid') {
                        setHumidLoading(true);
                        lower = humidInfo.lowerThreshold;
                        upper = humidInfo.upperThreshold;
                    }
                    else {
                        setMoistureLoading(true);
                        lower = moistureInfo.lowerThreshold;
                        upper = moistureInfo.upperThreshold;
                    }

                    if (lower == '' && upper == '') {
                        api_url = `http://localhost:3001/sensors/threshold/` + sensor + '?';
                    }
                    else if (lower == '') {
                        api_url = `http://localhost:3001/sensors/threshold/` + sensor + '?upper=' + upper;
                    }
                    else if (upper == '') {
                        api_url = `http://localhost:3001/sensors/threshold/` + sensor + '?lower=' + lower;
                    }
                    else {
                        api_url = `http://localhost:3001/sensors/threshold/` + sensor + '?upper=' + upper + '&lower=' + lower;
                    }

                    await axios.put(api_url, {}, config);
                    
                    // if (sensor == 'temp') {
                    //     setTempLoading(false);
                    // }
                    // else if (sensor == 'light') {
                    //     setLightLoading(false);
                    // }
                    // else if (sensor == 'humid') {
                    //     setHumidLoading(false);
                    // }
                    // else {
                    //     setMoistureLoading(false);
                    // }
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
                // } finally {
                //     if (sensor == 'temp') {
                //         setTempLoading(false);
                //     }
                //     else if (sensor == 'light') {
                //         setLightLoading(false);
                //     }
                //     else if (sensor == 'humid') {
                //         setHumidLoading(false);
                //     }
                //     else {
                //         setMoistureLoading(false);
                //     }
                // }
            };
            
            updateThreshold();
        }
    }

    return (
        <div>
            <div className='md:w-[650px] xl:w-[700px] 2xl:w-[900px]'>
                <div className='grid grid-cols-2 gap-[20px] w-full'>
                    <div className='col-span-1 bg-white h-[400px]'>
                        <div name='title-subtitle' className='ml-1 mt-2'>
                            <div name='title' className='font-bold'>
                                Nhiệt độ (°C)
                            </div>
                            <div name='subtitle'>Lấy từ cảm biến nhiệt độ</div>
                        </div>
                        <div className='w-[300px] h-[300px] mx-auto mt-2'>
                            <div className='flex flex-col justify-center items-center'>
                                {tempLoading ? (
                                <div className='md:w-[650px] xl:w-[700px] 2xl:w-[900px] h-[800px] text-center leading-[200px]'>
                                    <CircularProgress
                                        variant='indeterminate' value={50}
                                        size={50}
                                        thickness={3}
                                    />
                                </div>
                                ) : (
                                <div className='relative inline-flex'>
                                    <CircularProgress
                                        variant='determinate' value={(tempInfo.value < tempInfo.lowerThreshold) ? tempInfo.value : tempInfo.lowerThreshold - 0.1}
                                        size={250}
                                        thickness={3}   
                                        color={(tempInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(90deg)",
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(tempInfo.value > tempInfo.upperThreshold) ? tempInfo.upperThreshold - tempInfo.lowerThreshold - 0.4 : ((tempInfo.value > tempInfo.lowerThreshold) ? tempInfo.value - tempInfo.lowerThreshold - 0.4 : 0)}
                                        size={250}
                                        thickness={3}
                                        color={(tempInfo.needNoti ? 'warning' : 'success')}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + tempInfo.lowerThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(tempInfo.value > tempInfo.upperThreshold) ? tempInfo.value - tempInfo.upperThreshold - 0.4 : 0}
                                        size={250}
                                        thickness={3}
                                        color={(tempInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + tempInfo.upperThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={tempInfo.lowerThreshold - 0.01}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: 'lightGray',
                                            transform: "rotate(90deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={tempInfo.upperThreshold - tempInfo.lowerThreshold - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + tempInfo.lowerThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={100 - tempInfo.upperThreshold - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + tempInfo.upperThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1,
                                        }}
                                    />
                                    <div className='w-full h-full rounded-full bg-lightGray z-0 absolute'></div>
                                    <div className='flex top-0 left-0 bottom-0 right-0 absolute justify-center items-center'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <img src={(tempInfo.needNoti) ? TemperatureCelsiusWarning : TemperatureCelsiusGood} />
                                            <div className={'font-bold text-[1.5rem] text-center' + ((tempInfo.needNoti) ? ' text-warning' : ' text-success')}>
                                                {tempInfo.value} °C
                                                <div className='font-normal text-[1rem]'>{(tempInfo.needNoti) ? 'Nhiệt độ ngoài ngưỡng' : 'Nhiệt độ bình thường'}</div>
                                            </div>
                                            <div>
                                                {formatDateInfo(tempInfo.time)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div name="threshold" className='m-3'>
                                <div className='float-left'>
                                    Ngưỡng dưới
                                    {tempLoading ? (
                                    <div></div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={tempInfo.lowerThreshold }
                                            onChange={(e) => setTempInfo({ ...tempInfo, lowerThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "temp")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='float-right'>
                                    Ngưỡng trên
                                    {tempLoading ? (
                                    <div></div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={tempInfo.upperThreshold }
                                            // onChange={(e) => setTempInfo({ ...tempInfo, upperThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onChange={(e) => setTempInfo({ ...tempInfo, upperThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "temp")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='clear-both'></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 bg-white h-[400px]'>
                        <div name='title-subtitle' className='ml-1 mt-2'>
                            <div name='title' className='font-bold'>
                                Ánh sáng (lux)
                            </div>
                            <div name='subtitle'>Lấy từ cảm biến ánh sáng</div>
                        </div>
                        <div className='w-[300px] h-[300px] mx-auto mt-2'>
                            <div className='flex flex-col justify-center items-center'>
                                {lightLoading ? (
                                <div className='md:w-[650px] xl:w-[700px] 2xl:w-[900px] h-[800px] text-center leading-[200px]'>
                                    <CircularProgress
                                        variant='indeterminate' value={50}
                                        size={50}
                                        thickness={3}
                                    />
                                </div>
                                ) : (
                                <div className='relative inline-flex'>
                                    <CircularProgress
                                        variant='determinate' value={(lightInfo.valuePercent < lightInfo.lowerThresholdPercent) ? lightInfo.valuePercent : lightInfo.lowerThresholdPercent - 0.1}
                                        size={250}
                                        thickness={3}
                                        color={(lightInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(90deg)",
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(lightInfo.valuePercent > lightInfo.upperThresholdPercent) ? lightInfo.upperThresholdPercent - lightInfo.lowerThresholdPercent - 0.4 : ((lightInfo.valuePercent > lightInfo.lowerThresholdPercent) ? lightInfo.valuePercent - lightInfo.lowerThresholdPercent - 0.4 : 0)}
                                        size={250}
                                        thickness={3}
                                        color={(lightInfo.needNoti ? 'warning' : 'success')}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + lightInfo.lowerThresholdPercent*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(lightInfo.valuePercent > lightInfo.upperThresholdPercent) ? lightInfo.valuePercent - lightInfo.upperThresholdPercent - 0.4 : 0}
                                        size={250}
                                        thickness={3}
                                        color={(lightInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + lightInfo.upperThresholdPercent*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={lightInfo.lowerThresholdPercent - 0.01}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: 'lightGray',
                                            transform: "rotate(90deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={lightInfo.upperThresholdPercent - lightInfo.lowerThresholdPercent - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + lightInfo.lowerThresholdPercent*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={100 - lightInfo.upperThresholdPercent - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + lightInfo.upperThresholdPercent*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1,
                                        }}
                                    />
                                    <div className='w-full h-full rounded-full bg-lightGray z-0 absolute'></div>
                                    <div className='flex top-0 left-0 bottom-0 right-0 absolute justify-center items-center'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <img src={(lightInfo.needNoti) ? LightIntensityWarning : LightIntensityGood} />
                                            <div className={'font-bold text-[1.5rem] text-center' + ((lightInfo.needNoti) ? ' text-warning' : ' text-success')}>
                                                {lightInfo.value} lux
                                                <div className='font-normal text-[1rem]'>{(lightInfo.needNoti) ? 'Ánh sáng ngoài ngưỡng' : 'Ánh sáng bình thường'}</div>
                                            </div>
                                            <div>
                                                {formatDateInfo(lightInfo.time)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div name="threshold" className='m-3'>
                                <div className='float-left'>
                                    Ngưỡng dưới
                                    {lightLoading ? (
                                    <div >
                                    </div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={lightInfo.lowerThreshold }
                                            onChange={(e) => setLightInfo({ ...lightInfo, lowerThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "light")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='float-right'>
                                    Ngưỡng trên
                                    {lightLoading ? (
                                    <div >
                                    </div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={lightInfo.upperThreshold }
                                            onChange={(e) => setLightInfo({ ...lightInfo, upperThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "light")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='clear-both'></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 bg-white h-[400px]'>
                        <div name='title-subtitle' className='ml-1 mt-2'>
                            <div name='title' className='font-bold'>
                                Độ ẩm không khí (%)
                            </div>
                            <div name='subtitle'>Lấy từ cảm biến độ ẩm</div>
                        </div>
                        <div className='w-[300px] h-[300px] mx-auto mt-2'>
                            <div className='flex flex-col justify-center items-center'>
                                {humidLoading ? (
                                <div className='md:w-[650px] xl:w-[700px] 2xl:w-[900px] h-[800px] text-center leading-[200px]'>
                                    <CircularProgress
                                        variant='indeterminate' value={50}
                                        size={50}
                                        thickness={3}
                                    />
                                </div>
                                ) : (
                                <div className='relative inline-flex'>
                                    <CircularProgress
                                        variant='determinate' value={(humidInfo.value < humidInfo.lowerThreshold) ? humidInfo.value : humidInfo.lowerThreshold - 0.1}
                                        size={250}
                                        thickness={3}
                                        color={(humidInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(90deg)",
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(humidInfo.value > humidInfo.upperThreshold) ? humidInfo.upperThreshold - humidInfo.lowerThreshold - 0.4 : ((humidInfo.value > humidInfo.lowerThreshold) ? humidInfo.value - humidInfo.lowerThreshold - 0.4 : 0)}
                                        size={250}
                                        thickness={3}
                                        color={(humidInfo.needNoti ? 'warning' : 'success')}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + humidInfo.lowerThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(humidInfo.value > humidInfo.upperThreshold) ? humidInfo.value - humidInfo.upperThreshold - 0.4 : 0}
                                        size={250}
                                        thickness={3}
                                        color={(humidInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + humidInfo.upperThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={humidInfo.lowerThreshold - 0.01}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: 'lightGray',
                                            transform: "rotate(90deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={humidInfo.upperThreshold - humidInfo.lowerThreshold - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + humidInfo.lowerThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={100 - humidInfo.upperThreshold - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + humidInfo.upperThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1,
                                        }}
                                    />
                                    <div className='w-full h-full rounded-full bg-lightGray z-0 absolute'></div>
                                    <div className='flex top-0 left-0 bottom-0 right-0 absolute justify-center items-center'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <img src={(humidInfo.needNoti) ? AirHumidityWarning : AirHumidityGood} />
                                            <div className={'font-bold text-[1.5rem] text-center' + ((humidInfo.needNoti) ? ' text-warning' : ' text-success')}>
                                                {humidInfo.value} %
                                                <div className='font-normal text-[1rem]'>{(humidInfo.needNoti) ? 'Độ ẩm ngoài ngưỡng' : 'Độ ẩm bình thường'}</div>
                                            </div>
                                            <div>
                                                {formatDateInfo(humidInfo.time)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div name="threshold" className='m-3'>
                            <div className='float-left'>
                                    Ngưỡng dưới
                                    {humidLoading ? (
                                    <div >
                                    </div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={humidInfo.lowerThreshold }
                                            onChange={(e) => setHumidInfo({ ...humidInfo, lowerThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "humid")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='float-right'>
                                    Ngưỡng trên
                                    {humidLoading ? (
                                    <div >
                                    </div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={humidInfo.upperThreshold }
                                            onChange={(e) => setHumidInfo({ ...humidInfo, upperThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "humid")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='clear-both'></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 bg-white h-[400px]'>
                        <div name='title-subtitle' className='ml-1 mt-2'>
                            <div name='title' className='font-bold'>
                                Độ ẩm đất (%)
                            </div>
                            <div name='subtitle'>Lấy từ cảm biến độ ẩm đất</div>
                        </div>
                        <div className='w-[300px] h-[300px] mx-auto mt-2'>
                            <div className='flex flex-col justify-center items-center'>
                                {moistureLoading ? (
                                <div className='md:w-[650px] xl:w-[700px] 2xl:w-[900px] h-[800px] text-center leading-[200px]'>
                                    <CircularProgress
                                        variant='indeterminate' value={50}
                                        size={50}
                                        thickness={3}
                                    />
                                </div>
                                ) : (
                                <div className='relative inline-flex'>
                                <CircularProgress
                                        variant='determinate' value={(moistureInfo.value < moistureInfo.lowerThreshold) ? moistureInfo.value : moistureInfo.lowerThreshold - 0.1}
                                        size={250}
                                        thickness={3}
                                        color={(moistureInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(90deg)",
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(moistureInfo.value > moistureInfo.upperThreshold) ? moistureInfo.upperThreshold - moistureInfo.lowerThreshold - 0.4 : ((moistureInfo.value > moistureInfo.lowerThreshold) ? moistureInfo.value - moistureInfo.lowerThreshold - 0.4 : 0)}
                                        size={250}
                                        thickness={3}
                                        color={(moistureInfo.needNoti ? 'warning' : 'success')}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + moistureInfo.lowerThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress
                                        variant='determinate' value={(moistureInfo.value > moistureInfo.upperThreshold) ? moistureInfo.value - moistureInfo.upperThreshold - 0.4 : 0}
                                        size={250}
                                        thickness={3}
                                        color={(moistureInfo.needNoti) ? 'warning' : 'success'}
                                        style={{
                                            transform: "rotate(" + (Math.floor(90 + moistureInfo.upperThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 2,
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={moistureInfo.lowerThreshold - 0.01}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: 'lightGray',
                                            transform: "rotate(90deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={moistureInfo.upperThreshold - moistureInfo.lowerThreshold - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + moistureInfo.lowerThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                    />
                                    <CircularProgress   
                                        variant='determinate' value={100 - moistureInfo.upperThreshold - 0.4}
                                        size={250}
                                        thickness={3}
                                        style={{
                                            color: "lightGray",
                                            transform: "rotate(" + (Math.floor(90 + moistureInfo.upperThreshold*360/100) + 1) + "deg)",
                                            position: 'absolute',
                                            zIndex: 1,
                                        }}
                                    />
                                    <div className='w-full h-full rounded-full bg-lightGray z-0 absolute'></div>
                                    <div className='flex top-0 left-0 bottom-0 right-0 absolute justify-center items-center'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <img src={(moistureInfo.needNoti) ? SoilMoistureWarning : SoilMoistureGood} />
                                            <div className={'font-bold text-[1.5rem] text-center' + ((moistureInfo.needNoti) ? ' text-warning' : ' text-success')}>
                                                {moistureInfo.value} %
                                                <div className='font-normal text-[1rem]'>{(moistureInfo.needNoti) ? 'Độ ẩm ngoài ngưỡng' : 'Độ ẩm bình thường'}</div>
                                            </div>
                                            <div>
                                                {formatDateInfo(moistureInfo.time)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div name="threshold" className='m-3'>
                            <div className='float-left'>
                                    Ngưỡng dưới
                                    {moistureLoading ? (
                                    <div >
                                    </div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={moistureInfo.lowerThreshold }
                                            onChange={(e) => setMoistureInfo({ ...moistureInfo, lowerThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "moisture")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='float-right'>
                                    Ngưỡng trên
                                    {moistureLoading ? (
                                    <div >
                                    </div>
                                    ) : (
                                    <div className='mx-auto w-[80px] h-[25px]'>
                                        <input
                                            type="number"
                                            className="bg-mainRed text-center rounded-full w-full h-full text-white"
                                            value={moistureInfo.upperThreshold }
                                            onChange={(e) => setMoistureInfo({ ...moistureInfo, upperThreshold: (e.target.value != '') ? parseFloat(e.target.value) : ''})}
                                            onKeyDown={(e) => handleKeyDown(e, "moisture")}
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='clear-both'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}