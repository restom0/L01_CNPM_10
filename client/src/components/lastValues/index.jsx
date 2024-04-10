import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {CircularProgress} from '@mui/material';
import TemperatureCelsiusGood from '../../assets/images/temperature-celsius-good.svg';
import TemperatureCelsiusWarning from '../../assets/images/temperature-celsius-warning.svg';
import LightIntensityGood from '../../assets/images/light-intensity-good.svg';
import LightIntensityWarning from '../../assets/images/light-intensity-warning.svg';
import SoilMoistureWarning from '../../assets/images/soil-moisture-warning.svg';
import SoilMoistureGood from '../../assets/images/soil-moisture-good.svg';
import AirHumidityWarning from '../../assets/images/air-humidity-warning.svg';
import AirHumidityGood from '../../assets/images/air-humidity-good.svg';

function formatDateInfo(inputTime) {
    const date = new Date(inputTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
        return `Hôm nay lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (isYesterday) {
        return `Hôm qua lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
    }
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

export default function LastValues() {
    const [tempInfo, setTempInfo] = useState(null);
    const [lightInfo, setLightInfo] = useState(null);
    const [humidInfo, setHumidInfo] = useState(null);
    const [moistureInfo, setMoistureInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    // const sessionID = document.cookie.split('; ').find((cookie) => cookie.startsWith(`sessionID=`)).split('=')[1]
    const sessionID = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTI3ODgzMTksImRhdGEiOiI2NjEzOTA2NDNhMzE5ZmViZGMxNzQxNDIiLCJpYXQiOjE3MTI3NTk1MTl9.p8mgMIWO4b3RHh8zewZU9KOZ_EXnw2MzKVCI1wBJ5cs";
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
                        // lowerThreshold: tempResponse.data.lower,
                        // upperThreshold: tempResponse.data.upper,
                        lowerThreshold: 15,
                        upperThreshold: 40,
                        condition: tempResponse.data.data.value >= tempResponse.data.lower && tempResponse.data.data.value <= tempResponse.data.upper,
                    }
                );
                setLightInfo(
                    {
                        value: parseFloat(lightResponse.data.data.value),
                        valuePercent: lightResponse.data.data.value * 100 / 10000,
                        time: formatTime(lightResponse.data.data.created_at),
                        // lowerThreshold: lightResponse.data.lower,
                        // lowerThresholdPercent: lightResponse.data.lower * 100 / 10000,
                        // upperThreshold: lightResponse.data.upper,
                        // upperThresholdPercent: lightResponse.data.upper * 100 / 10000,
                        lowerThreshold: 2000,
                        upperThreshold: 5000,
                        lowerThresholdPercent: 2000 * 100 / 10000,
                        upperThresholdPercent: 5000 * 100 / 10000,
                        condition: lightResponse.data.data.value >= 2000 && lightResponse.data.data.value <= 5000
                    }
                );
                setHumidInfo(
                    {
                        value: parseFloat(humidResponse.data.data.value),
                        time: formatTime(humidResponse.data.data.created_at),
                        // lowerThreshold: humidResponse.data.lower,
                        // upperThreshold: humidResponse.data.upper,
                        lowerThreshold: 40,
                        upperThreshold: 70,
                        condition: humidResponse.data.data.value >= 40 && humidResponse.data.data.value <= 70
                    }
                );
                console.log(moistureResponse.data.data.value)
                console.log(0.0)
                setMoistureInfo(
                    {
                        value: parseFloat(moistureResponse.data.data.value),
                        time: formatTime(moistureResponse.data.data.created_at),
                        // lowerThreshold: moistureResponse.data.lower,
                        // upperThreshold: moistureResponse.data.upper,
                        lowerThreshold: 60,
                        upperThreshold: 70,
                        condition: moistureResponse.data.data.value >= 60 && moistureResponse.data.data.value <= 70
                    }
                );
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchApiData();

        const intervalId = setInterval(fetchApiData, 5 * 1000);

        return () => clearInterval(intervalId);
    }, []);
    
    return (
        <div>
            {loading ? (
                <div className='md:w-[650px] xl:w-[700px] 2xl:w-[900px] h-[800px] text-center leading-[200px]'>
                    <CircularProgress
                        variant='indeterminate' value={50}
                        size={50}
                        thickness={3}
                    />
                </div>
                ) : (
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
                                    <div className='relative inline-flex'>
                                        <CircularProgress
                                            variant='determinate' value={(tempInfo.value < tempInfo.lowerThreshold) ? tempInfo.value : tempInfo.lowerThreshold - 0.1}
                                            size={250}
                                            thickness={3}
                                            color={(tempInfo.condition) ? 'success' : 'warning'}
                                            style={{
                                                transform: "rotate(90deg)",
                                                zIndex: 2,
                                            }}
                                        />
                                        <CircularProgress
                                            variant='determinate' value={(tempInfo.value > tempInfo.upperThreshold) ? tempInfo.upperThreshold - tempInfo.lowerThreshold - 0.4 : ((tempInfo.value > tempInfo.lowerThreshold) ? tempInfo.value - tempInfo.lowerThreshold - 0.4 : 0)}
                                            size={250}
                                            thickness={3}
                                            color={(tempInfo.condition ? 'success' : 'warning')}
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
                                            color={(tempInfo.condition) ? 'success' : 'warning'}
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
                                                <img src={(tempInfo.condition) ? TemperatureCelsiusGood : TemperatureCelsiusWarning} />
                                                <div className={'font-bold text-[1.5rem] text-center' + ((tempInfo.condition) ? ' text-success' : ' text-warning')}>
                                                    {tempInfo.value} °C
                                                    <div className='font-normal text-[1rem]'>{(tempInfo.condition) ? 'Nhiệt độ bình thường' : 'Nhiệt độ ngoài ngưỡng'}</div>
                                                </div>
                                                <div>
                                                    {formatDateInfo(tempInfo.time)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div name="threshold" className='m-3'>
                                    <div className='float-left'>
                                        Ngưỡng dưới
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{tempInfo.lowerThreshold}</div>
                                    </div>
                                    <div className='float-right'>
                                        Ngưỡng trên
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{tempInfo.upperThreshold}</div>
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
                                    <div className='relative inline-flex'>
                                        <CircularProgress
                                            variant='determinate' value={(lightInfo.valuePercent < lightInfo.lowerThresholdPercent) ? lightInfo.valuePercent : lightInfo.lowerThresholdPercent - 0.1}
                                            size={250}
                                            thickness={3}
                                            color={(lightInfo.condition) ? 'success' : 'warning'}
                                            style={{
                                                transform: "rotate(90deg)",
                                                zIndex: 2,
                                            }}
                                        />
                                        <CircularProgress
                                            variant='determinate' value={(lightInfo.valuePercent > lightInfo.upperThresholdPercent) ? lightInfo.upperThresholdPercent - lightInfo.lowerThresholdPercent - 0.4 : ((lightInfo.valuePercent > lightInfo.lowerThresholdPercent) ? lightInfo.valuePercent - lightInfo.lowerThresholdPercent - 0.4 : 0)}
                                            size={250}
                                            thickness={3}
                                            color={(lightInfo.condition ? 'success' : 'warning')}
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
                                            color={(lightInfo.condition) ? 'success' : 'warning'}
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
                                                <img src={(lightInfo.condition) ? LightIntensityGood : LightIntensityWarning} />
                                                <div className={'font-bold text-[1.5rem] text-center' + ((lightInfo.condition) ? ' text-success' : ' text-warning')}>
                                                    {lightInfo.value} lux
                                                    <div className='font-normal text-[1rem]'>{(lightInfo.condition) ? 'Ánh sáng bình thường' : 'Ánh sáng ngoài ngưỡng'}</div>
                                                </div>
                                                <div>
                                                    {formatDateInfo(lightInfo.time)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div name="threshold" className='m-3'>
                                    <div className='float-left'>
                                        Ngưỡng dưới
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{lightInfo.lowerThreshold}</div>
                                    </div>
                                    <div className='float-right'>
                                        Ngưỡng trên
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{lightInfo.upperThreshold}</div>
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
                                    <div className='relative inline-flex'>
                                        <CircularProgress
                                            variant='determinate' value={(humidInfo.value < humidInfo.lowerThreshold) ? humidInfo.value : humidInfo.lowerThreshold - 0.1}
                                            size={250}
                                            thickness={3}
                                            color={(humidInfo.condition) ? 'success' : 'warning'}
                                            style={{
                                                transform: "rotate(90deg)",
                                                zIndex: 2,
                                            }}
                                        />
                                        <CircularProgress
                                            variant='determinate' value={(humidInfo.value > humidInfo.upperThreshold) ? humidInfo.upperThreshold - humidInfo.lowerThreshold - 0.4 : ((humidInfo.value > humidInfo.lowerThreshold) ? humidInfo.value - humidInfo.lowerThreshold - 0.4 : 0)}
                                            size={250}
                                            thickness={3}
                                            color={(humidInfo.condition ? 'success' : 'warning')}
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
                                            color={(humidInfo.condition) ? 'success' : 'warning'}
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
                                                <img src={(humidInfo.condition) ? AirHumidityGood : AirHumidityWarning} />
                                                <div className={'font-bold text-[1.5rem] text-center' + ((humidInfo.condition) ? ' text-success' : ' text-warning')}>
                                                    {humidInfo.value} %
                                                    <div className='font-normal text-[1rem]'>{(humidInfo.condition) ? 'Độ ẩm bình thường' : 'Độ ẩm ngoài ngưỡng'}</div>
                                                </div>
                                                <div>
                                                    {formatDateInfo(humidInfo.time)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div name="threshold" className='m-3'>
                                    <div className='float-left'>
                                        Ngưỡng dưới
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{humidInfo.lowerThreshold}</div>
                                    </div>
                                    <div className='float-right'>
                                        Ngưỡng trên
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{humidInfo.upperThreshold}</div>
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
                                    <div className='relative inline-flex'>
                                    <CircularProgress
                                            variant='determinate' value={(moistureInfo.value < moistureInfo.lowerThreshold) ? moistureInfo.value : moistureInfo.lowerThreshold - 0.1}
                                            size={250}
                                            thickness={3}
                                            color={(moistureInfo.condition) ? 'success' : 'warning'}
                                            style={{
                                                transform: "rotate(90deg)",
                                                zIndex: 2,
                                            }}
                                        />
                                        <CircularProgress
                                            variant='determinate' value={(moistureInfo.value > moistureInfo.upperThreshold) ? moistureInfo.upperThreshold - moistureInfo.lowerThreshold - 0.4 : ((moistureInfo.value > moistureInfo.lowerThreshold) ? moistureInfo.value - moistureInfo.lowerThreshold - 0.4 : 0)}
                                            size={250}
                                            thickness={3}
                                            color={(moistureInfo.condition ? 'success' : 'warning')}
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
                                            color={(moistureInfo.condition) ? 'success' : 'warning'}
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
                                                <img src={(moistureInfo.condition) ? SoilMoistureGood : SoilMoistureWarning} />
                                                <div className={'font-bold text-[1.5rem] text-center' + ((moistureInfo.condition) ? ' text-success' : ' text-warning')}>
                                                    {moistureInfo.value} %
                                                    <div className='font-normal text-[1rem]'>{(moistureInfo.condition) ? 'Độ ẩm bình thường' : 'Độ ẩm ngoài ngưỡng'}</div>
                                                </div>
                                                <div>
                                                    {formatDateInfo(moistureInfo.time)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div name="threshold" className='m-3'>
                                    <div className='float-left'>
                                        Ngưỡng dưới
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{moistureInfo.lowerThreshold}</div>
                                    </div>
                                    <div className='float-right'>
                                        Ngưỡng trên
                                        <div className='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>{moistureInfo.upperThreshold}</div>
                                    </div>
                                    <div className='clear-both'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}