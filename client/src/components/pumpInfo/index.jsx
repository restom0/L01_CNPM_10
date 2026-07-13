import PumpState from '../pumpState'

import React from 'react';
import { useI18n } from '../../i18n';
import { classes } from '../../styles/classes';

export default function PumpInfo(props) {
    const { t } = useI18n();
    
    return (
        <div className='md:w-[280px] xl:w-[400px] 2xl:w-[400px]'>
            <div className={`h-[400px] ${classes.panel}`}>
                <div name='title-subtitle' className={classes.panelTitle}>
                    <div name='title' className='font-bold'>
                        {t('pump.info')}
                    </div>
                </div>
                <hr className={classes.separator}></hr>
                <PumpState api_token={props.api_token}/>
            </div>
        </div>
    );
}
