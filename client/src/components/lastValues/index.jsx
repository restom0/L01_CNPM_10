import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import {CircularProgress} from '@mui/material';
import TemperatureCelsiusGood from '../../assets/images/temperature-celsius-good.svg';
import TemperatureCelsiusWarning from '../../assets/images/temperature-celsius-warning.svg';
export default function LastValues() {
    const threshold = {bot:30,top:37};
    const lastValueAndTime = {
        temp1: {
            value:30,
            time:"15:30"
        },
    }
    var temp1 = lastValueAndTime.temp1.value;
    var condition1 = temp1 >= threshold.bot && temp1 <= threshold.top;
    return (
        <div className='xl:w-[700px] 2xl:w-[1000px]'>
            <div className='grid grid-cols-2 gap-[20px]'>
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
                                    variant='determinate' value={(temp1 < threshold.bot) ? temp1 : threshold.bot - 0.1}
                                    size={250}
                                    thickness={3}
                                    color={(condition1) ? 'success' : 'warning'}
                                    style={{
                                        transform: "rotate(90deg)",
                                        zIndex: 2,
                                    }}
                                />
                                <CircularProgress
                                    variant='determinate' value={(temp1 > threshold.top) ? threshold.top - threshold.bot - 0.4 : ((temp1 > threshold.bot) ? temp1 - threshold.bot - 0.4 : 0)}
                                    size={250}
                                    thickness={3}
                                    color={(condition1 ? 'success' : 'warning')}
                                    style={{
                                        transform: "rotate(" + (Math.floor(90 + threshold.bot*360/100) + 1) + "deg)",
                                        position: 'absolute',
                                        zIndex: 2,
                                    }}
                                />
                                <CircularProgress
                                    variant='determinate' value={(temp1 > threshold.top) ? temp1 - threshold.top - 0.4 : 0}
                                    size={250}
                                    thickness={3}
                                    color={(condition1) ? 'success' : 'warning'}
                                    style={{
                                        transform: "rotate(" + (Math.floor(90 + threshold.top*360/100) + 1) + "deg)",
                                        position: 'absolute',
                                        zIndex: 2,
                                    }}
                                />
                                <CircularProgress   
                                    variant='determinate' value={29.9}
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
                                    variant='determinate' value={6.6}
                                    size={250}
                                    thickness={3}
                                    style={{
                                        color: "lightGray",
                                        transform: "rotate(199deg)",
                                        position: 'absolute',
									    zIndex: 1
                                    }}
                                />
                                <CircularProgress   
                                    variant='determinate' value={63}
                                    size={250}
                                    thickness={3}
                                    style={{
                                        color: "lightGray",
                                        transform: "rotate(224deg)",
                                        position: 'absolute',
									    zIndex: 1,
                                    }}
                                />
                                <div className='w-full h-full rounded-full bg-lightGray z-0 absolute'></div>
                                <div className='flex top-0 left-0 bottom-0 right-0 absolute justify-center items-center'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <img src={(condition1) ? TemperatureCelsiusGood : TemperatureCelsiusWarning} />
                                        <div className={'font-bold text-[1.5rem] text-center' + ((condition1) ? ' text-success' : ' text-warning')}>
                                            {temp1} °C
                                            <div className='font-normal text-[1rem]'>{(condition1) ? 'Nhiệt độ bình thường' : 'Nhiệt độ ngoài ngưỡng'}</div>
                                        </div>
                                        <div>
                                            Hôm nay lúc {lastValueAndTime.temp1.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div name="threshold" className='m-3'>
                            <div class='float-left'>
                                Ngưỡng dưới
                                <div class='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>30</div>
                            </div>
                            <div class='float-right'>
                                Ngưỡng trên
                                <div class='bg-mainRed mx-auto text-center rounded-full w-[50px] text-white'>37</div>
                            </div>
                            <div class='clear-both'></div>
                        </div>
                    </div>
                </div>
                <div className='col-span-1 bg-white h-[400px]'></div>
                <div className='col-span-1 bg-white h-[400px]'></div>
                <div className='col-span-1 bg-white h-[400px]'></div>
            </div>
        </div>
    );
}