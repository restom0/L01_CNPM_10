import PumpState from '../pumpState'

import React from 'react';
import { useI18n } from '../../i18n';

export default function PumpInfo(props) {
    const { t } = useI18n();
    
    return (
        <div className='md:w-[280px] xl:w-[400px] 2xl:w-[400px]'>
            <div className='h-[400px] bg-white'>
                <div name='title-subtitle' className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    <div name='title' className='font-bold'>
                        {t('pump.info')}
                    </div>
                </div>
                {/* <p name='description' className='mt-2'>Các máy bơm đang được thiếp lập tự động tưới vào lúc 05:00, 11:00, 16:00 mỗi ngày, mỗi lần tưới 10 phút.</p> */}
                <hr className="mt-[var(--spacing-section)] border border-solid"></hr>
                <PumpState api_token={props.api_token}/>
            </div>
        </div>
    );
}
