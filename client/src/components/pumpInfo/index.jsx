import PumpState from '../pumpState'

import React, { useState, useEffect } from 'react';

export default function PumpInfo(props) {
    
    return (
        <div className='md:w-[280px] xl:w-[400px] 2xl:w-[400px]'>
            <div className='h-[400px] bg-white'>
                <div name='title-subtitle' className='pl-1 pt-2'>
                    <div name='title' className='font-bold'>
                        Thông tin máy bơm
                    </div>
                </div>
                {/* <p name='description' className='mt-2'>Các máy bơm đang được thiếp lập tự động tưới vào lúc 05:00, 11:00, 16:00 mỗi ngày, mỗi lần tưới 10 phút.</p> */}
                <hr className="mt-4 border border-solid"></hr>
                <PumpState api_token={props.api_token}/>
            </div>
        </div>
    );
}